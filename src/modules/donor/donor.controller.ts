import { Controller, Get, Put, Body, UseGuards, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DonorService } from './donor.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Donors')
@ApiBearerAuth('JWT-auth')
@Controller('donors')
export class DonorController {
  constructor(
    private readonly donorService: DonorService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('eligible')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CLIENT')
  @ApiOperation({ summary: 'Get eligible donors for donation' })
  async getEligibleDonors() {
    return this.donorService.findEligibleDonors();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current donor profile' })
  async getProfile(@CurrentUser('id') userId: number) {
    return this.donorService.getDonorProfile(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update donor profile' })
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() data: any,
  ) {
    return this.donorService.updateDonorProfile(userId, data);
  }

  @Get(':id/eligibility')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if donor is eligible to donate' })
  async checkEligibility(@Param('id', ParseIntPipe) id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Donor not found');
    
    const isEligible = await this.donorService.isEligibleToDonate(user.lastDonationDate);
    return { isEligible, lastDonationDate: user.lastDonationDate };
  }
}