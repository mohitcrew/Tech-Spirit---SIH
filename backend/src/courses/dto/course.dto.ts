import { Role, UserStatus, CourseLevel, CourseStatus, EnrollmentStatus, NotificationType, ResourceType } from '../../common/enums';
﻿  import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'; export class CreateCourseDto{@IsString()title!:string;@IsString()description!:string;@IsString()category!:string;@IsString()department!:string;@IsString()level!:string;@IsInt()@Min(1)durationHours!:number;@IsArray()learningObjectives!:string[];@IsOptional()@IsString()thumbnailUrl?:string;@IsOptional()@IsString()status?:string} export class AddModuleDto{@IsString()title!:string;@IsString()description!:string;@IsInt()@Min(1)order!:number}


