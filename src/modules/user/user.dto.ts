import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, IsDate, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  userType: string;

  @ApiProperty({ example: 'O_POSITIVE', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: 'MALE', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastDonationDate?: Date;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Updated', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'O_POSITIVE', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: 'MALE', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isProfileComplete?: boolean;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastDonationDate?: Date;
}

export class UserQueryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ example: '+1234', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'O_POSITIVE', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: 'DONOR', required: false })
  @IsOptional()
  @IsString()
  userType?: string;

  @ApiProperty({ example: 'Dhaka', required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ example: 'Savar', required: false })
  @IsOptional()
  @IsString()
  upazila?: string;

  @ApiProperty({ example: 'Area name', required: false })
  @IsOptional()
  @IsString()
  area?: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Updated', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ example: 'O_POSITIVE', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: 'AVAILABLE', required: false })
  @IsOptional()
  @IsString()
  availableStatus?: string;

  @ApiProperty({ example: 'MALE', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastDonationDate?: Date;

  @ApiProperty({ example: 'Dhaka', required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ example: 'Savar', required: false })
  @IsOptional()
  @IsString()
  upazila?: string;

  @ApiProperty({ example: 'Area name', required: false })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiProperty({ example: 'Additional info', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @ApiProperty({ example: 'https://facebook.com', required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ example: 'https://linkedin.com', required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiProperty({ example: 'https://twitter.com', required: false })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiProperty({ example: 'https://website.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;
}