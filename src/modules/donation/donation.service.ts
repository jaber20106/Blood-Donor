import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDonationDto } from './donation.dto';

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateDonationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.userType !== 'DONOR') throw new BadRequestException('Only donors can record donations');

    if (user.lastDonationDate) {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      if (user.lastDonationDate > ninetyDaysAgo) {
        throw new BadRequestException('Donor is not eligible. Must wait 90 days between donations.');
      }
    }

    const donation = await this.prisma.donation.create({
      data: {
        userId,
        donationDate: dto.donationDate || new Date(),
        location: dto.location,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { lastDonationDate: dto.donationDate || new Date() },
    });

    if (user.profile) {
      await this.prisma.donorProfile.update({
        where: { userId },
        data: { totalDonations: { increment: 1 } },
      });
    }

    return donation;
  }

  async findByUser(userId: number) {
    return this.prisma.donation.findMany({
      where: { userId },
      orderBy: { donationDate: 'desc' },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [donations, total] = await Promise.all([
      this.prisma.donation.findMany({
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, phone: true, bloodGroup: true } } },
        orderBy: { donationDate: 'desc' },
      }),
      this.prisma.donation.count(),
    ]);

    return {
      data: donations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getDonationStats() {
    const total = await this.prisma.donation.count();
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const thisMonthCount = await this.prisma.donation.count({
      where: { donationDate: { gte: thisMonth } },
    });

    return { total, thisMonth: thisMonthCount };
  }
}