import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable() export class UsersService { constructor(private p:PrismaService){}
list(){return this.p.user.findMany({include:{profile:true},omit:{passwordHash:true}})}
me(id:string){return this.p.user.findUnique({where:{id},include:{profile:true},omit:{passwordHash:true}})}
async updateMe(id:string,d:any){const u=await this.p.user.update({where:{id},data:{profile:{upsert:{update:{...d, skills: d.skills ? d.skills.join(',') : '', interests: d.interests ? d.interests.join(',') : ''},create:{...d, skills: d.skills ? d.skills.join(',') : '', interests: d.interests ? d.interests.join(',') : '', userId:id}}}},omit:{passwordHash:true}}).catch(()=>null);if(!u)throw new NotFoundException('User not found');return u}
async updateUser(id:string,d:any){const u=await this.p.user.update({where:{id},data:d,omit:{passwordHash:true}}).catch(()=>null);if(!u)throw new NotFoundException('User not found');return u}
}
