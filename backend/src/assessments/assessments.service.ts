import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async get(id: string) {
    const a = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: { select: { id: true, text: true } },
          },
        },
      },
    });
    if (!a) throw new NotFoundException('Assessment not found');
    return a;
  }

  create(user: any, d: any) {
    return this.prisma.assessment.create({
      data: {
        ...d,
        course: { connect: { id: d.courseId } },
      },
    });
  }

  addQuestion(id: string, d: any) {
    return this.prisma.question.create({
      data: {
        assessmentId: id,
        text: d.text,
        order: d.order,
        options: {
          create: d.options.map((x: any) => ({
            text: x.text,
            isCorrect: x.isCorrect,
          })),
        },
      },
    });
  }

  async submit(userId: string, id: string, answers: { questionId: string; optionId: string }[]) {
    const a = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        course: true,
        questions: { include: { options: true } },
      },
    });

    if (!a || !a.isPublished) {
      throw new BadRequestException('Assessment is unavailable');
    }

    const correct = a.questions.filter((q) =>
      answers.some(
        (x) =>
          x.questionId === q.id &&
          q.options.some((o) => o.id === x.optionId && o.isCorrect),
      ),
    ).length;

    const score = a.questions.length ? Math.round((correct / a.questions.length) * 100) : 0;
    const passed = score >= a.passingScore;

    const attempt = await this.prisma.assessmentAttempt.create({
      data: {
        assessmentId: id,
        userId,
        score,
        passed,
        answers: { create: answers },
      },
      include: { assessment: true },
    });

    let certificate: any = null;

    if (passed) {
      await this.prisma.enrollment.updateMany({
        where: { userId, courseId: a.courseId },
        data: { progress: 100, status: 'COMPLETED' },
      });

      const certCode = `CC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

      certificate = await this.prisma.certificate.create({
        data: {
          certificateCode: certCode,
          userId,
          courseId: a.courseId,
          attemptId: attempt.id,
        },
      });

      await this.prisma.notification.create({
        data: {
          userId,
          type: 'CERTIFICATE_ISSUED',
          title: 'Certificate issued',
          message: `You passed ${a.title} and your certificate is ready.`,
        },
      });
    }

    // Asynchronously dispatch email notifications
    this.prisma.user
      .findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true },
      })
      .then(async (user) => {
        if (user) {
          // 1. Assessment Result Email
          await this.emailService.sendAssessmentResult(user, {
            title: a.title,
            score,
            passed,
          }).catch((err) => console.warn('Assessment result email failed:', err.message));

          // 2. If passed, Certificate Generated Email
          if (passed && certificate) {
            await this.emailService.sendCertificateGenerated(user, {
              code: certificate.certificateCode,
              courseTitle: a.course?.title || a.title,
            }).catch((err) => console.warn('Certificate email failed:', err.message));
          }
        }
      })
      .catch(() => {});

    return { attempt, certificate };
  }

  results(userId: string, id: string) {
    return this.prisma.assessmentAttempt.findMany({
      where: { userId, assessmentId: id },
      include: { certificate: true },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
