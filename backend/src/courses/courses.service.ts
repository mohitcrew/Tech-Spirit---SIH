import { Role, UserStatus, CourseLevel, CourseStatus, EnrollmentStatus, NotificationType, ResourceType } from '../common/enums';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';   
import { PrismaService } from '../prisma/prisma.service'; 
import { AddModuleDto,CreateCourseDto } from './dto/course.dto';
import { EmailService } from '../email/email.service';

@Injectable() 
export class CoursesService {
  constructor(
    private p: PrismaService,
    private emailService: EmailService,
  ) {} 

  list(q:any){
    return this.p.course.findMany({where:{status:CourseStatus.PUBLISHED,...(q.category?{category:q.category}:{}),...(q.level?{level:q.level}:{}),...(q.department?{department:q.department}:{})},include:{trainer:{select:{id:true,name:true}},_count:{select:{modules:true,enrollments:true}}},orderBy:{createdAt:'desc'}})
  } 

  async one(id:string){
    const x=await this.p.course.findUnique({where:{id},include:{trainer:{select:{id:true,name:true}},modules:{orderBy:{order:'asc'}},resources:true,assessments:{where:{isPublished:true},select:{id:true,title:true,passingScore:true}}}});
    if(!x)throw new NotFoundException('Course not found');
    return x
  }

  create(user:any,d:CreateCourseDto){
    return this.p.course.create({data:{...d,learningObjectives:d.learningObjectives.join('\n'),trainerId:user.id,status:d.status||CourseStatus.DRAFT}})
  } 

  async update(user:any,id:string,d:Partial<CreateCourseDto>){
    const c=await this.p.course.findUnique({where:{id}});
    if(!c)throw new NotFoundException('Course not found');
    if(user.role!==Role.ADMIN&&c.trainerId!==user.id)throw new ForbiddenException();
    return this.p.course.update({where:{id},data:{...d, learningObjectives:d.learningObjectives ? d.learningObjectives.join('\n') : undefined}})
  } 

  async remove(user:any,id:string){
    await this.update(user,id,{});
    return this.p.course.delete({where:{id}})
  } 

  addModule(user:any,id:string,d:AddModuleDto){
    return this.update(user,id,{}).then(()=>this.p.courseModule.create({data:{...d,courseId:id}}))
  } 

  async enroll(userId:string,courseId:string){
    const course = await this.one(courseId);
    const e=await this.p.enrollment.upsert({where:{userId_courseId:{userId,courseId}},update:{},create:{userId,courseId}});
    await this.p.notification.create({data:{userId,type:'COURSE_ENROLLMENT',title:'Enrollment confirmed',message:'You are enrolled and can begin learning.'}});
    
    // Asynchronously dispatch course assignment email
    this.p.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, role: true } })
      .then(u => {
        if (u) {
          this.emailService.sendCourseAssigned(u, { id: course.id, title: course.title }).catch(err => {
            console.warn('Course assigned email failed:', err.message);
          });
        }
      })
      .catch(() => {});

    return e
  } 

  enrollments(id:string){
    return this.p.enrollment.findMany({where:{userId:id},include:{course:{include:{trainer:{select:{name:true}},modules:true,assessments:{where:{isPublished:true}}}}}})
  } 
}