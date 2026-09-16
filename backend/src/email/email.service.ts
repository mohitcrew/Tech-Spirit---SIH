import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

export interface RecipientInfo {
  id?: string;
  email: string;
  name?: string;
  role?: string;
}

export interface SendEmailOptions {
  eventId?: string;
  triggerType?: 'AUTOMATIC' | 'ADMIN_MANUAL';
  subject?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private universalTemplateHtml: string = '';

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.loadUniversalTemplate();
  }

  /**
   * Loads universal-template.html from disk with fallback locations
   */
  private loadUniversalTemplate() {
    const candidates = [
      path.resolve(__dirname, '../../../../Emailjs/universal-template.html'),
      path.resolve(__dirname, '../../../Emailjs/universal-template.html'),
      path.resolve(process.cwd(), '../Emailjs/universal-template.html'),
      path.resolve(process.cwd(), 'Emailjs/universal-template.html'),
      'C:\\Users\\mohit\\Desktop\\SIH-2\\Emailjs\\universal-template.html',
    ];

    for (const p of candidates) {
      if (fs.existsSync(p)) {
        try {
          this.universalTemplateHtml = fs.readFileSync(p, 'utf-8');
          this.logger.log(`Successfully loaded universal email template from: ${p}`);
          return;
        } catch (err) {
          this.logger.warn(`Failed reading template at ${p}: ${(err as Error).message}`);
        }
      }
    }

    this.logger.warn('Could not locate universal-template.html on disk. Using built-in minimal fallback.');
  }

  /**
   * Safe variable resolver: substitutes {{variable}} with safe values, no undefined
   */
  private resolveVariables(
    templateConfig: any,
    recipient: RecipientInfo,
    customVars: Record<string, string> = {},
  ): Record<string, string> {
    let defaults: Record<string, string> = {};
    if (templateConfig?.defaultVariables) {
      try {
        defaults = typeof templateConfig.defaultVariables === 'string'
          ? JSON.parse(templateConfig.defaultVariables)
          : templateConfig.defaultVariables;
      } catch (e) {
        defaults = {};
      }
    }

    const resolved: Record<string, string> = {
      user_name: recipient.name || 'SkillSync Learner',
      user_email: recipient.email,
      category_tag: defaults.category_tag || templateConfig?.category?.toUpperCase() || 'PLATFORM NOTIFICATION',
      eyebrow_badge: defaults.eyebrow_badge || 'SKILLSYNC INTELLIGENCE',
      headline_prefix: defaults.headline_prefix || 'Notification for',
      headline_highlight: defaults.headline_highlight || recipient.name || 'Member',
      hero_description: defaults.hero_description || 'You have a new update regarding your SkillSync learning progress and competencies.',
      cta_text: defaults.cta_text || 'Access Dashboard →',
      cta_url: defaults.cta_url || 'http://localhost:5173/dashboard',
      alert_title: defaults.alert_title || 'Platform Notice',
      alert_message: defaults.alert_message || 'Please log in to your account to review detailed action items and requirements.',
      detail_label_1: defaults.detail_label_1 || 'Recipient Role',
      detail_val_1: defaults.detail_val_1 || recipient.role || 'Member',
      detail_label_2: defaults.detail_label_2 || 'Platform Status',
      detail_val_2: defaults.detail_val_2 || 'Active',
      status_badge_text: defaults.status_badge_text || 'ACTIVE',
      ...defaults,
      ...customVars,
    };

    // Ensure no undefined or null values
    for (const key of Object.keys(resolved)) {
      if (resolved[key] === undefined || resolved[key] === null) {
        resolved[key] = '';
      } else {
        resolved[key] = String(resolved[key]);
      }
    }

    return resolved;
  }

  /**
   * Generates pure HTML preview by replacing placeholders in universal-template.html
   */
  public renderHtml(variables: Record<string, string>): string {
    if (!this.universalTemplateHtml) {
      this.loadUniversalTemplate();
    }

    let html = this.universalTemplateHtml || `
      <div style="font-family: sans-serif; padding: 24px; color: #1e293b; background: #f8fafc;">
        <h1 style="color: #2563eb;">SkillSync: {{headline_prefix}} {{headline_highlight}}</h1>
        <p><strong>To:</strong> {{user_name}} &lt;{{user_email}}&gt;</p>
        <p>{{hero_description}}</p>
        <div style="margin: 20px 0;">
          <a href="{{cta_url}}" style="background: #2563eb; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px;">{{cta_text}}</a>
        </div>
        <hr style="border: 1px solid #e2e8f0;"/>
        <p style="font-size: 12px; color: #64748b;">{{detail_label_1}}: {{detail_val_1}} | {{detail_label_2}}: {{detail_val_2}}</p>
      </div>
    `;

    for (const [key, val] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      html = html.replace(regex, val);
    }

    return html;
  }

  /**
   * Preview an email with live template resolution
   */
  async previewEmail(templateKey: string, variables: Record<string, string>, recipient?: RecipientInfo) {
    const templateConfig = await this.prisma.emailTemplateConfig.findUnique({
      where: { templateKey },
    });

    const targetRecipient: RecipientInfo = recipient || {
      email: variables.user_email || 'preview.recipient@skillsync.demo',
      name: variables.user_name || 'Aarav Sharma',
      role: 'TRAINEE',
    };

    const resolved = this.resolveVariables(templateConfig, targetRecipient, variables);
    const html = this.renderHtml(resolved);
    const subject = variables.subject || templateConfig?.subject || 'SkillSync Platform Notification';

    return {
      templateKey,
      subject,
      recipient: targetRecipient,
      variables: resolved,
      html,
    };
  }

  /**
   * Centralized generic method to send any template email
   */
  async sendTemplate(
    templateKey: string,
    recipient: RecipientInfo,
    customVariables: Record<string, string> = {},
    options: SendEmailOptions = {},
  ) {
    const triggerType = options.triggerType || 'AUTOMATIC';

    // 1. Idempotency check if eventId is provided
    if (options.eventId) {
      const existing = await this.prisma.emailLog.findFirst({
        where: {
          eventId: options.eventId,
          status: { in: ['SENT', 'QUEUED'] },
        },
      });
      if (existing) {
        this.logger.warn(`Idempotency check: event ${options.eventId} already processed (Log ID: ${existing.id}). Skipping.`);
        return existing;
      }
    }

    // 2. Fetch template config
    const templateConfig = await this.prisma.emailTemplateConfig.findUnique({
      where: { templateKey },
    });

    if (!templateConfig) {
      this.logger.error(`Template ${templateKey} not found in database.`);
      throw new NotFoundException(`Email template '${templateKey}' is not configured.`);
    }

    if (!templateConfig.enabled) {
      this.logger.warn(`Template '${templateKey}' is disabled. Suppressing email.`);
      return null;
    }

    if (triggerType === 'AUTOMATIC' && !templateConfig.automaticEnabled) {
      this.logger.warn(`Template '${templateKey}' has automatic triggering disabled. Suppressing.`);
      return null;
    }

    // 3. Resolve variables
    const variables = this.resolveVariables(templateConfig, recipient, customVariables);
    const subject = options.subject || templateConfig.subject;

    // 4. Create PENDING / QUEUED log in database
    const emailLog = await this.prisma.emailLog.create({
      data: {
        recipientUserId: recipient.id || null,
        recipientEmail: recipient.email,
        recipientRole: recipient.role || null,
        templateKey,
        category: templateConfig.category,
        subject,
        status: 'QUEUED',
        triggerType,
        variables: JSON.stringify(variables),
        provider: 'EmailJS',
        eventId: options.eventId || null,
      },
    });

    // 5. Dispatch via EmailJS or Simulated Sandbox
    return await this.dispatchEmail(emailLog.id, templateConfig.emailjsTemplateId, variables, recipient.email);
  }

  /**
   * Internal dispatcher connecting to EmailJS or simulated delivery
   */
  private async dispatchEmail(
    logId: string,
    emailjsTemplateId: string,
    variables: Record<string, string>,
    recipientEmail: string,
  ) {
    const serviceId = this.config.get<string>('EMAILJS_SERVICE_ID') || 'service_2rnemfk';
    const templateId = emailjsTemplateId || this.config.get<string>('EMAILJS_TEMPLATE_ID') || 'template_v4oblec';
    const publicKey = this.config.get<string>('EMAILJS_PUBLIC_KEY');

    this.logger.log(`Dispatching email (Log: ${logId}) to ${recipientEmail} via template ${templateId}`);

    // If live EmailJS credentials are provided, attempt real HTTP dispatch
    if (publicKey && publicKey.trim() !== '') {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              ...variables,
              to_email: recipientEmail,
            },
          }),
        });

        if (response.ok) {
          const text = await response.text();
          return await this.prisma.emailLog.update({
            where: { id: logId },
            data: {
              status: 'SENT',
              sentAt: new Date(),
              providerMessageId: `emailjs-${Date.now()}`,
              errorMessage: null,
            },
          });
        } else {
          const errText = await response.text();
          throw new Error(`EmailJS API error (${response.status}): ${errText}`);
        }
      } catch (err: any) {
        this.logger.error(`EmailJS delivery failed for Log ID ${logId}: ${err.message}`);
        return await this.handleFailure(logId, err.message);
      }
    } else {
      // In Development / Demo Mode without public key: simulate high-fidelity delivery
      this.logger.log(`[Demo/Dev Mode] Simulated delivery recorded for ${recipientEmail}`);
      return await this.prisma.emailLog.update({
        where: { id: logId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          providerMessageId: `SIM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          errorMessage: null,
        },
      });
    }
  }

  /**
   * Failure & Retry Handler
   */
  private async handleFailure(logId: string, errorMessage: string) {
    const current = await this.prisma.emailLog.findUnique({ where: { id: logId } });
    if (!current) return null;

    const newRetryCount = (current.retryCount || 0) + 1;
    const maxRetries = 3;

    if (newRetryCount < maxRetries) {
      return await this.prisma.emailLog.update({
        where: { id: logId },
        data: {
          status: 'RETRYING',
          retryCount: newRetryCount,
          errorMessage: `Attempt ${newRetryCount} failed: ${errorMessage}`,
        },
      });
    } else {
      return await this.prisma.emailLog.update({
        where: { id: logId },
        data: {
          status: 'FAILED',
          retryCount: newRetryCount,
          errorMessage: `Final failure after ${newRetryCount} attempts: ${errorMessage}`,
        },
      });
    }
  }

  /**
   * Resend a previously sent or failed email
   */
  async resendEmail(logId: string) {
    const log = await this.prisma.emailLog.findUnique({ where: { id: logId } });
    if (!log) {
      throw new NotFoundException(`Email log '${logId}' not found.`);
    }

    const templateConfig = await this.prisma.emailTemplateConfig.findUnique({
      where: { templateKey: log.templateKey },
    });

    let variables: Record<string, string> = {};
    if (log.variables) {
      try {
        variables = JSON.parse(log.variables);
      } catch (e) {
        variables = {};
      }
    }

    // Update log status to RETRYING or QUEUED
    await this.prisma.emailLog.update({
      where: { id: logId },
      data: {
        status: 'QUEUED',
        retryCount: (log.retryCount || 0) + 1,
      },
    });

    return await this.dispatchEmail(
      log.id,
      templateConfig?.emailjsTemplateId || 'template_v4oblec',
      variables,
      log.recipientEmail,
    );
  }

  /**
   * Health Statistics for Dashboard Widget
   */
  async getHealthStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [sentToday, failedCount, queuedCount, retryingCount, totalAllTime, sentAllTime] = await Promise.all([
      this.prisma.emailLog.count({
        where: {
          status: 'SENT',
          sentAt: { gte: startOfToday },
        },
      }),
      this.prisma.emailLog.count({
        where: { status: 'FAILED' },
      }),
      this.prisma.emailLog.count({
        where: { status: 'QUEUED' },
      }),
      this.prisma.emailLog.count({
        where: { status: 'RETRYING' },
      }),
      this.prisma.emailLog.count(),
      this.prisma.emailLog.count({
        where: { status: 'SENT' },
      }),
    ]);

    const deliveryRate = totalAllTime > 0 ? Math.round((sentAllTime / totalAllTime) * 100) : 100;

    return {
      sentToday,
      failed: failedCount,
      queued: queuedCount,
      retried: retryingCount,
      deliveryRate,
      totalCount: totalAllTime,
    };
  }

  /**
   * Query delivery history with flexible filters
   */
  async getHistory(params: {
    search?: string;
    status?: string;
    templateKey?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }
    if (params.templateKey && params.templateKey !== 'ALL') {
      where.templateKey = params.templateKey;
    }
    if (params.category && params.category !== 'ALL') {
      where.category = params.category;
    }
    if (params.search) {
      where.OR = [
        { recipientEmail: { contains: params.search } },
        { subject: { contains: params.search } },
        { templateKey: { contains: params.search } },
      ];
    }

    const [total, logs] = await Promise.all([
      this.prisma.emailLog.count({ where }),
      this.prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      logs,
    };
  }

  /**
   * Template Catalog Listing
   */
  async getTemplates() {
    return this.prisma.emailTemplateConfig.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async updateTemplateConfig(templateKey: string, data: any) {
    return this.prisma.emailTemplateConfig.update({
      where: { templateKey },
      data,
    });
  }

  // =========================================================================
  // Specific Scenario Helper Methods
  // =========================================================================

  async sendWelcome(user: { id: string; email: string; name: string }) {
    return this.sendTemplate(
      'welcome-registration',
      { id: user.id, email: user.email, name: user.name, role: 'TRAINEE' },
      {
        user_name: user.name,
        user_email: user.email,
        headline_highlight: user.name.split(' ')[0] || 'Learner',
      },
      { eventId: `welcome-${user.id}` },
    );
  }

  async sendCourseAssigned(user: RecipientInfo, course: { id: string; title: string; dueDate?: string }) {
    return this.sendTemplate(
      'course-assigned',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: course.title,
        detail_label_1: 'Course Name',
        detail_val_1: course.title,
        detail_label_2: 'Target Due Date',
        detail_val_2: course.dueDate || '30 Days from Enrollment',
      },
      { eventId: `course-assigned-${user.id}-${course.id}` },
    );
  }

  async sendCourseReminder(user: RecipientInfo, course: { id: string; title: string; dueDate?: string }) {
    return this.sendTemplate(
      'course-deadline',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: 'Milestone Approaching',
        detail_label_1: 'Enrolled Course',
        detail_val_1: course.title,
        detail_label_2: 'Final Submission Date',
        detail_val_2: course.dueDate || 'Within 48 Hours',
      },
    );
  }

  async sendTrainingRegistration(user: RecipientInfo, training: { title: string; date: string; time?: string }) {
    return this.sendTemplate(
      'training-registered',
      user,
      {
        user_name: user.name || 'Participant',
        headline_highlight: 'Seat Confirmed',
        detail_label_1: 'Masterclass Workshop',
        detail_val_1: training.title,
        detail_label_2: 'Scheduled Date & Time',
        detail_val_2: `${training.date} ${training.time || '10:00 AM IST'}`,
      },
    );
  }

  async sendTrainingReminder(user: RecipientInfo, training: { title: string; time: string; link?: string }) {
    return this.sendTemplate(
      'training-reminder',
      user,
      {
        user_name: user.name || 'Participant',
        headline_highlight: 'Live Session Starting',
        detail_label_1: 'Workshop Title',
        detail_val_1: training.title,
        detail_label_2: 'Commencement Time',
        detail_val_2: training.time,
        cta_url: training.link || 'https://meet.skillsync.edu/live-session',
      },
    );
  }

  async sendAssessmentAssigned(user: RecipientInfo, assessment: { title: string; dueDate?: string }) {
    return this.sendTemplate(
      'assessment-assigned',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: 'Diagnostic Ready',
        detail_label_1: 'Assessment Name',
        detail_val_1: assessment.title,
        detail_label_2: 'Submission Deadline',
        detail_val_2: assessment.dueDate || 'Within 72 Hours',
      },
    );
  }

  async sendAssessmentResult(user: RecipientInfo, result: { title: string; score: number; passed: boolean }) {
    return this.sendTemplate(
      'assessment-result',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: result.passed ? 'Certified & Passed' : 'Evaluation Completed',
        detail_label_1: 'Assessment',
        detail_val_1: result.title,
        detail_label_2: 'Final Benchmark Score',
        detail_val_2: `${result.score}% (${result.passed ? 'PASSED' : 'RETAKE RECOMMENDED'})`,
        status_badge_text: result.passed ? 'PASSED' : 'COMPLETED',
      },
    );
  }

  async sendSkillGapDetected(user: RecipientInfo, data: { skillGaps: string[]; targetRole: string }) {
    return this.sendTemplate(
      'skill-gap-detected',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: 'Radar Analysis',
        detail_label_1: 'Target Career Role',
        detail_val_1: data.targetRole,
        detail_label_2: 'Priority Deficits',
        detail_val_2: data.skillGaps.slice(0, 3).join(', '),
      },
    );
  }

  async sendCompetencyImprovement(user: RecipientInfo, data: { skill: string; fromLevel: string; toLevel: string }) {
    return this.sendTemplate(
      'competency-improved',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: 'Competency Elevated',
        detail_label_1: 'Technical Skill',
        detail_val_1: data.skill,
        detail_label_2: 'Benchmark Advancement',
        detail_val_2: `${data.fromLevel} → ${data.toLevel}`,
      },
    );
  }

  async sendLearningPathRecommendation(user: RecipientInfo, pathTitle: string) {
    return this.sendTemplate(
      'recommended-learning-path',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: 'Tailored Pathway',
        detail_label_1: 'Recommended Trajectory',
        detail_val_1: pathTitle,
        detail_label_2: 'Alignment Confidence',
        detail_val_2: '94% Match with Target Role',
      },
    );
  }

  async sendCertificateGenerated(user: RecipientInfo, certificate: { code: string; courseTitle: string }) {
    return this.sendTemplate(
      'certificate-generated',
      user,
      {
        user_name: user.name || 'Learner',
        headline_highlight: 'Official Credential',
        detail_label_1: 'Credential Title',
        detail_val_1: certificate.courseTitle,
        detail_label_2: 'Certificate ID',
        detail_val_2: certificate.code,
      },
      { eventId: `cert-${certificate.code}` },
    );
  }

  async sendTrainerAssignment(trainer: RecipientInfo, cohort: { name: string; learnerCount: number }) {
    return this.sendTemplate(
      'trainer-assigned',
      trainer,
      {
        user_name: trainer.name || 'Trainer',
        headline_highlight: 'Faculty Dispatch',
        detail_label_1: 'Assigned Cohort',
        detail_val_1: cohort.name,
        detail_label_2: 'Enrolled Learners',
        detail_val_2: `${cohort.learnerCount} Active Students`,
      },
    );
  }

  async sendAdminNotification(admin: RecipientInfo, alert: { title: string; message: string; severity?: string }) {
    return this.sendTemplate(
      'admin-system-alert',
      admin,
      {
        user_name: admin.name || 'Administrator',
        headline_highlight: 'Operational Telemetry',
        alert_title: alert.title,
        alert_message: alert.message,
        detail_label_1: 'Severity Level',
        detail_val_1: alert.severity || 'PRIORITY 1',
        detail_label_2: 'Monitoring Node',
        detail_val_2: 'Production Web Cluster',
      },
    );
  }
}
