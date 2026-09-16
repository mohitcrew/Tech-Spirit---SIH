import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private p: PrismaService,
    private emailService: EmailService,
  ) {}

  list() {
    return this.p.user.findMany({ include: { profile: true }, omit: { passwordHash: true } });
  }

  me(id: string) {
    return this.p.user.findUnique({ where: { id }, include: { profile: true }, omit: { passwordHash: true } });
  }

  async updateMe(id: string, d: any) {
    const { onboardingCompleted, name, ...profileData } = d;
    const updateData: any = {};
    if (onboardingCompleted !== undefined) {
      updateData.onboardingCompleted = onboardingCompleted;
    }
    if (name !== undefined) {
      updateData.name = name;
    }
    if (Object.keys(profileData).length > 0) {
      updateData.profile = {
        upsert: {
          update: {
            ...profileData,
            ...(profileData.skills !== undefined ? { skills: Array.isArray(profileData.skills) ? profileData.skills.join(',') : profileData.skills } : {}),
            ...(profileData.interests !== undefined ? { interests: Array.isArray(profileData.interests) ? profileData.interests.join(',') : profileData.interests } : {}),
          },
          create: {
            ...profileData,
            skills: profileData.skills ? (Array.isArray(profileData.skills) ? profileData.skills.join(',') : profileData.skills) : '',
            interests: profileData.interests ? (Array.isArray(profileData.interests) ? profileData.interests.join(',') : profileData.interests) : '',
          },
        },
      };
    }
    const u = await this.p.user.update({
      where: { id },
      data: updateData,
      include: { profile: true },
      omit: { passwordHash: true },
    }).catch((err) => {
      console.error('updateMe error:', err);
      return null;
    });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async updateUser(id: string, d: any) {
    const u = await this.p.user.update({ where: { id }, data: d, omit: { passwordHash: true } }).catch(() => null);
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  /**
   * Sends a welcome email to the currently authenticated user.
   * Called right after onboarding completion.
   */
  async sendWelcomeEmail(userId: string) {
    const user = await this.p.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) throw new NotFoundException('User not found');
    try {
      await this.emailService.sendWelcome(user);
      return { success: true, message: `Welcome email dispatched to ${user.email}` };
    } catch (err: any) {
      // Non-fatal: log and return a graceful response
      console.error('sendWelcomeEmail error:', err.message);
      return { success: false, message: err.message };
    }
  }
}
