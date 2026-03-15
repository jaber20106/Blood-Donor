import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DonorService {
  constructor(private prisma: PrismaService) {}

  async findEligibleDonors() {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return this.prisma.user.findMany({
      where: {
        userType: 'DONOR',
        isActive: true,
        OR: [
          { lastDonationDate: null },
          { lastDonationDate: { lt: ninetyDaysAgo } },
        ],
      },
      include: { profile: true },
    });
  }

  async getDonorBadge(totalDonations: number): Promise<string> {
    if (totalDonations >= 15) return 'GOLD';
    if (totalDonations >= 6) return 'SILVER';
    return 'BRONZE';
  }

  async isEligibleToDonate(lastDonationDate: Date | null): Promise<boolean> {
    if (!lastDonationDate) return true;
    
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    return lastDonationDate < ninetyDaysAgo;
  }

  async getDonorProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        donations: { orderBy: { donationDate: 'desc' } },
      },
    });
    if (!user) throw new NotFoundException('Donor not found');
    return user;
  }

  async updateDonorProfile(userId: number, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: userId },
      data: { isProfileComplete: true },
    });

    return this.prisma.donorProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
}