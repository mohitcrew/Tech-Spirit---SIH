import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsBoolean() onboardingCompleted?: boolean;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() employeeId?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() designation?: string;
  @IsOptional() @IsString() qualification?: string;
  @IsOptional() @IsInt() @Min(0) experience?: number;
  @IsOptional() @IsArray() skills?: string[];
  @IsOptional() @IsArray() interests?: string[];
  @IsOptional() @IsString() photoUrl?: string;
}

