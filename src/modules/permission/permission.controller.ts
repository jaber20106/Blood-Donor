import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from './permission.service';

@ApiTags('Permissions')
@ApiBearerAuth('JWT-auth')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(PERMISSIONS.READ_PERMISSION)
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll() {
    return this.permissionService.findAll();
  }
}