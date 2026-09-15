import { Role, UserStatus, CourseLevel, CourseStatus, EnrollmentStatus, NotificationType, ResourceType } from '../common/enums';
﻿import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
 

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private p: PrismaService) {}

  @Get('audit-logs')
  auditLogs() {
    return this.p.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Get('announcements')
  listAnnouncements() {
    return this.p.announcement.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post('announcements')
  createAnnouncement(@Body() d: any) {
    return this.p.announcement.create({ data: d });
  }
}

