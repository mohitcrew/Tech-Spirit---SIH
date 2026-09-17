import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Req() req: any) {
    const userId = req.user.id;
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Patch('read-all')
  async readAll(@Req() req: any) {
    const userId = req.user.id;
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true, count: result.count };
  }

  @Patch(':id/read')
  async read(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    return { success: true, id };
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    await this.prisma.notification.deleteMany({
      where: { id, userId },
    });
    return { success: true, id };
  }

  @Post('test')
  async createTestNotification(
    @Req() req: any,
    @Body() body: { title?: string; message?: string; type?: string },
  ) {
    const userId = req.user.id;
    const notif = await this.prisma.notification.create({
      data: {
        userId,
        title: body.title || 'Platform Notification',
        message: body.message || 'You have received a new update on SkillSync.',
        type: body.type || 'SYSTEM',
        isRead: false,
      },
    });
    return { success: true, notification: notif };
  }
}
