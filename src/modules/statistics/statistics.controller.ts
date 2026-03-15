import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../permission/permission.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get public statistics for landing page' })
  async getPublicStats() {
    return this.statisticsService.getPublicStats();
  }

  @Get('donations-per-month')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.READ_STATISTICS)
  @ApiOperation({ summary: 'Get donations per month chart data' })
  async getDonationsPerMonth(@Query('year') year: number) {
    return this.statisticsService.getDonationsPerMonth(year || new Date().getFullYear());
  }

  @Get('new-users-per-month')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.READ_STATISTICS)
  @ApiOperation({ summary: 'Get new users per month chart data' })
  async getNewUsersPerMonth(@Query('year') year: number) {
    return this.statisticsService.getNewUsersPerMonth(year || new Date().getFullYear());
  }

  @Get('active-districts')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.READ_STATISTICS)
  @ApiOperation({ summary: 'Get most active districts' })
  async getActiveDistricts(@Query('limit') limit: number) {
    return this.statisticsService.getMostActiveDistricts(limit || 10);
  }
}