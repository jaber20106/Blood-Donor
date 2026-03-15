import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { SearchDonorsDto } from './client.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Client (Blood Seeker)')
@ApiBearerAuth('JWT-auth')
@Controller('client')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT', 'ADMIN')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search donors with filters' })
  async searchDonors(@Query() query: SearchDonorsDto) {
    return this.clientService.searchDonors(query);
  }

  @Post('contact/:donorId')
  @ApiOperation({ summary: 'Contact a donor' })
  async contactDonor(
    @Param('donorId', ParseIntPipe) donorId: number,
    @CurrentUser('id') requesterId: number,
  ) {
    return this.clientService.contactDonor(donorId, requesterId);
  }
}