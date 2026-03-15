import { Controller, Get, Post, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './donation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../permission/permission.service';

@ApiTags('Donations')
@ApiBearerAuth('JWT-auth')
@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DONOR', 'ADMIN')
  @ApiOperation({ summary: 'Record a new donation' })
  async create(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateDonationDto,
  ) {
    return this.donationService.create(userId, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my donation history' })
  async getMyDonations(@CurrentUser('id') userId: number) {
    return this.donationService.findByUser(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.READ_DONATION)
  @ApiOperation({ summary: 'Get all donations (Admin)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.donationService.findAll(page || 1, limit || 10);
  }
}