import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchDonorsDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ example: 'O_POSITIVE', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: 'Bangladesh', required: false })
  @IsOptional()
  @IsString()
  country?: string;

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