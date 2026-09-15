import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssessmentsService } from './assessments.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums';

@UseGuards(AuthGuard('jwt'))
@Controller('assessments')
export class AssessmentsController {
  constructor(private s: AssessmentsService) {}

  @Get(':id')
  get(@Param('id') id: string) { return this.s.get(id); }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  @Post()
  create(@Req() r: any, @Body() d: any) { return this.s.create(r.user, d); }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TRAINER)
  @Post(':id/questions')
  q(@Param('id') id: string, @Body() d: any) { return this.s.addQuestion(id, d); }

  @Post(':id/submit')
  submit(@Req() r: any, @Param('id') id: string, @Body() d: any) { return this.s.submit(r.user.id, id, d.answers); }

  @Get(':id/results')
  results(@Req() r: any, @Param('id') id: string) { return this.s.results(r.user.id, id); }
}
