import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminAnalyticsService } from './admin-analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PERMISSIONS } from '../permission/permission.service';

@ApiTags('Admin Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Permissions(PERMISSIONS.READ_ALL)
@Roles('ADMIN')
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get('inactive-donors')
  @ApiOperation({ summary: 'Get inactive donors (no login for 6 months)' })
  async getInactiveDonors() {
    return this.adminAnalyticsService.getInactiveDonors();
  }

  @Get('suspicious-accounts')
  @ApiOperation({ summary: 'Get suspicious accounts' })
  async getSuspiciousAccounts() {
    return this.adminAnalyticsService.getSuspiciousAccounts();
  }

  @Get('incomplete-profiles')
  @ApiOperation({ summary: 'Get users with incomplete profiles' })
  async getIncompleteProfiles() {
    return this.adminAnalyticsService.getIncompleteProfiles();
  }
}