import { IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDonationDto {
  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  donationDate?: Date;

  @ApiProperty({ example: 'Red Crescent Blood Bank, Dhaka' })
  @IsOptional()
  @IsString()
  location?: string;
}