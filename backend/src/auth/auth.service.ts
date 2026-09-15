import { Role, UserStatus, CourseLevel, CourseStatus, EnrollmentStatus, NotificationType, ResourceType } from '../common/enums';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'; 
import { JwtService } from '@nestjs/jwt'; 
import { PrismaService } from '../prisma/prisma.service'; 
import * as argon2 from 'argon2'; 
import { LoginDto, RegisterDto } from './dto/auth.dto';  

@Injectable() 
export class AuthService { 
  constructor(private p:PrismaService,private jwt:JwtService){}

  async register(d:RegisterDto){
    if(d.role===Role.ADMIN) throw new UnauthorizedException('Administrator accounts are provisioned only by the system');
    if(await this.p.user.findUnique({where:{email:d.email}})) throw new ConflictException('Email is already registered'); 
    const u=await this.p.user.create({data:{name:d.name,email:d.email,passwordHash:await argon2.hash(d.password),role:d.role,status:UserStatus.ACTIVE,profile:{create:{department:d.department,designation:d.designation, skills: '', interests: ''}}}});
    return this.token(u)
  }

  async login(d:LoginDto){
    const u=await this.p.user.findUnique({where:{email:d.email}});
    if(!u||u.status!==UserStatus.ACTIVE||!(await argon2.verify(u.passwordHash,d.password))) throw new UnauthorizedException('Invalid email or password');
    return this.token(u)
  }

  async me(id:string){
    return this.p.user.findUnique({where:{id},include:{profile:true},omit:{passwordHash:true}})
  } 

  private token(u:{id:string;email:string;role:string;name:string}){
    return {accessToken:this.jwt.sign({sub:u.id,email:u.email,role:u.role}),user:{id:u.id,email:u.email,name:u.name,role:u.role}}
  } 
}