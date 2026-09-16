import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums';
import { EmailService } from '../email/email.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // =========================================================================
  // User Management
  // =========================================================================

  @Get('users')
  async listUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('domain') domain?: string,
    @Query('status') status?: string,
    @Query('onboardingStatus') onboardingStatus?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '25',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const skip = (pageNum - 1) * take;

    const where: any = {};

    if (role && role !== 'ALL') {
      where.role = role;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (onboardingStatus && onboardingStatus !== 'ALL') {
      where.onboardingStatus = onboardingStatus;
    }

    if (domain && domain !== 'ALL') {
      where.profile = { domain: { contains: domain } };
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          onboardingCompleted: true,
          onboardingStatus: true,
          firstLoginRequired: true,
          createdAt: true,
          lastLoginAt: true,
          profile: {
            select: {
              sector: true,
              domain: true,
              targetRole: true,
              experience: true,
              skills: true,
              designation: true,
              department: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              certificates: true,
              emailLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    return {
      total,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(total / take),
      users,
    };
  }

  @Patch('users/:id/status')
  async toggleUserStatus(
    @Param('id') id: string,
    @Body('status') newStatus?: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    const updatedStatus = newStatus || (user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: updatedStatus },
      select: { id: true, email: true, name: true, status: true },
    });

    return {
      message: `User status changed to ${updatedStatus}`,
      user: updated,
    };
  }

  // =========================================================================
  // Email Center Endpoints
  // =========================================================================

  @Get('email/templates')
  async listEmailTemplates() {
    return this.emailService.getTemplates();
  }

  @Patch('email/templates/:key')
  async updateEmailTemplate(
    @Param('key') key: string,
    @Body() body: any,
  ) {
    return this.emailService.updateTemplateConfig(key, body);
  }

  @Get('email/history')
  async listEmailHistory(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('templateKey') templateKey?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.emailService.getHistory({
      search,
      status,
      templateKey,
      category,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('email/health')
  async getEmailHealth() {
    return this.emailService.getHealthStats();
  }

  @Post('email/preview')
  async previewEmail(
    @Body('templateKey') templateKey: string,
    @Body('variables') variables: Record<string, string>,
    @Body('recipient') recipient?: any,
  ) {
    if (!templateKey) {
      throw new BadRequestException('templateKey is required');
    }
    return this.emailService.previewEmail(templateKey, variables || {}, recipient);
  }

  @Post('email/send')
  async sendEmail(
    @Body('templateKey') templateKey: string,
    @Body('recipient') recipient?: any,
    @Body('variables') variables?: Record<string, string>,
    @Body('subject') subject?: string,
    @Body('bulkFilter') bulkFilter?: { role?: string; domain?: string },
  ) {
    if (!templateKey) {
      throw new BadRequestException('templateKey is required');
    }

    // Bulk cohort send
    if (bulkFilter && (bulkFilter.role || bulkFilter.domain)) {
      const where: any = { status: 'ACTIVE' };
      if (bulkFilter.role && bulkFilter.role !== 'ALL') {
        where.role = bulkFilter.role;
      }
      if (bulkFilter.domain && bulkFilter.domain !== 'ALL') {
        where.profile = { domain: { contains: bulkFilter.domain } };
      }

      const users = await this.prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, role: true },
      });

      const results = [];
      for (const u of users) {
        try {
          const res = await this.emailService.sendTemplate(
            templateKey,
            { id: u.id, email: u.email, name: u.name, role: u.role },
            variables || {},
            { triggerType: 'ADMIN_MANUAL', subject },
          );
          results.push({ email: u.email, status: 'SUCCESS', logId: res?.id });
        } catch (e: any) {
          results.push({ email: u.email, status: 'FAILED', error: e.message });
        }
      }

      return {
        message: `Bulk email processed for ${users.length} recipients`,
        recipientCount: users.length,
        results,
      };
    }

    // Single recipient send
    if (!recipient || !recipient.email) {
      throw new BadRequestException('Recipient email is required for single send');
    }

    const log = await this.emailService.sendTemplate(
      templateKey,
      recipient,
      variables || {},
      { triggerType: 'ADMIN_MANUAL', subject },
    );

    return {
      message: 'Email dispatched successfully',
      log,
    };
  }

  @Post('email/resend')
  async resendEmail(@Body('logId') logId: string) {
    if (!logId) {
      throw new BadRequestException('logId is required');
    }
    const log = await this.emailService.resendEmail(logId);
    return {
      message: 'Email resend initiated',
      log,
    };
  }

  // =========================================================================
  // Announcements & Audit Logs
  // =========================================================================

  @Get('audit-logs')
  auditLogs() {
    return this.prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Get('announcements')
  listAnnouncements() {
    return this.prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post('announcements')
  createAnnouncement(@Body() d: any) {
    return this.prisma.announcement.create({ data: d });
  }
}
