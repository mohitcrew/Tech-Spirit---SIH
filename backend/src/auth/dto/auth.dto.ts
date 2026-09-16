import { Role, UserStatus, CourseLevel, CourseStatus, EnrollmentStatus, NotificationType, ResourceType } from '../../common/enums';
﻿import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';  
export class RegisterDto { @IsString() name!:string; @IsEmail() email!:string; @MinLength(8) password!:string; @IsString() role!:string; @IsOptional() @IsString() department?:string; @IsOptional() @IsString() designation?:string }
export class LoginDto { @IsString() email!:string; @IsString() password!:string }


