import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getInactiveDonors() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return this.prisma.user.findMany({
      where: {
        userType: 'DONOR',
        isActive: true,
        updatedAt: { lt: sixMonthsAgo },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        lastDonationDate: true,
        updatedAt: true,
      },
    });
  }

  async getSuspiciousAccounts() {
    const donors = await this.prisma.user.findMany({
      where: { userType: 'DONOR', isActive: true },
      include: { profile: true },
    });

    const suspicious = donors.filter((d) => {
      if (!d.profile?.district || !d.profile?.upazila) return true;
      if (!d.email || !d.phone) return true;
      return false;
    });

    return suspicious.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      hasIncompleteProfile: !d.profile?.district || !d.profile?.upazila,
    }));
  }

  async getIncompleteProfiles() {
    return this.prisma.user.findMany({
      where: {
        isProfileComplete: false,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }
}