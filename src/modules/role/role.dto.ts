import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'CUSTOM_ROLE' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];
}

export class UpdateRoleDto {
  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}