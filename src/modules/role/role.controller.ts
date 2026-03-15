import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.service';

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Permissions(PERMISSIONS.READ_ROLE)
  @ApiOperation({ summary: 'Get all roles' })
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.READ_ROLE)
  @ApiOperation({ summary: 'Get role by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findById(id);
  }

  @Post()
  @Permissions(PERMISSIONS.WRITE_ROLE)
  @ApiOperation({ summary: 'Create new role' })
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Put(':id')
  @Permissions(PERMISSIONS.WRITE_ROLE)
  @ApiOperation({ summary: 'Update role' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.WRITE_ROLE)
  @ApiOperation({ summary: 'Delete role' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
}