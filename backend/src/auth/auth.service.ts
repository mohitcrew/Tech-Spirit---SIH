import { Role, UserStatus, CourseLevel, CourseStatus, EnrollmentStatus, NotificationType, ResourceType } from '../common/enums';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'; 
import { JwtService } from '@nestjs/jwt'; 
import { PrismaService } from '../prisma/prisma.service'; 
import * as argon2 from 'argon2'; 
import { LoginDto, RegisterDto } from './dto/auth.dto';  

import { EmailService } from '../email/email.service';

@Injectable() 
export class AuthService { 
  constructor(
    private p: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  async register(d:RegisterDto){
    if(d.role===Role.ADMIN) throw new UnauthorizedException('Administrator accounts are provisioned only by the system');
    if(await this.p.user.findUnique({where:{email:d.email}})) throw new ConflictException('Email is already registered'); 
    const u=await this.p.user.create({data:{name:d.name,email:d.email,passwordHash:await argon2.hash(d.password),role:d.role,status:UserStatus.ACTIVE,profile:{create:{department:d.department,designation:d.designation, skills: '', interests: ''}}}});
    
    // Asynchronously trigger welcome email notification
    this.emailService.sendWelcome(u).catch(err => {
      console.warn('Welcome email dispatch deferred or failed:', err.message);
    });

    return this.token(u)
  }

  async login(d:LoginDto){
    const raw = (d.email || '').trim();
    let emailToFind = raw.toLowerCase();

    // Map ID formats like STU-012, TRN-001, STU-051
    const stuMatch = raw.match(/^STU-0*(\d+)$/i);
    const trnMatch = raw.match(/^TRN-0*(\d+)$/i);

    if (stuMatch) {
      const num = parseInt(stuMatch[1], 10);
      if (num === 51) {
        emailToFind = 'mohit199189@gmail.com';
      } else {
        emailToFind = `student${String(num).padStart(3, '0')}@skillsync.demo`;
      }
    } else if (trnMatch) {
      const num = parseInt(trnMatch[1], 10);
      emailToFind = `trainer${String(num).padStart(3, '0')}@skillsync.demo`;
    }

    const u = await this.p.user.findFirst({
      where: {
        OR: [
          { email: raw },
          { email: emailToFind },
        ],
      },
    });

    if (!u || u.status !== UserStatus.ACTIVE || !(await argon2.verify(u.passwordHash, d.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.token(u);
  }

  async me(id:string){
    return this.p.user.findUnique({where:{id},include:{profile:true},omit:{passwordHash:true}})
  } 

  private token(u:{id:string;email:string;role:string;name:string;onboardingCompleted?:boolean}){
    return {accessToken:this.jwt.sign({sub:u.id,email:u.email,role:u.role}),user:{id:u.id,email:u.email,name:u.name,role:u.role,onboardingCompleted:u.onboardingCompleted ?? false}}
  } 
}