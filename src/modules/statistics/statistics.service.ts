import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getPublicStats() {
    const [
      totalDonors,
      totalDonations,
      availableDonors,
      districtsCovered,
    ] = await Promise.all([
      this.prisma.user.count({ where: { userType: 'DONOR', isActive: true } }),
      this.prisma.donation.count(),
      this.prisma.donorProfile.count({ where: { availableStatus: 'AVAILABLE' } }),
      this.prisma.donorProfile.findMany({
        where: { district: { not: null } },
        select: { district: true },
        distinct: ['district'],
      }),
    ]);

    return {
      totalDonors,
      totalDonations,
      availableDonors,
      districtsCovered: Array.isArray(districtsCovered) ? districtsCovered.length : 0,
    };
  }

  async getDonationsPerMonth(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const donations = await this.prisma.donation.findMany({
      where: {
        donationDate: { gte: startDate, lte: endDate },
      },
      select: { donationDate: true },
    });

    const monthlyData = Array(12).fill(0);
    donations.forEach((d) => {
      const month = d.donationDate.getMonth();
      monthlyData[month]++;
    });

    return monthlyData.map((count, index) => ({
      month: index + 1,
      count,
    }));
  }

  async getNewUsersPerMonth(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { createdAt: true },
    });

    const monthlyData = Array(12).fill(0);
    users.forEach((u) => {
      const month = u.createdAt.getMonth();
      monthlyData[month]++;
    });

    return monthlyData.map((count, index) => ({
      month: index + 1,
      count,
    }));
  }

  async getMostActiveDistricts(limit = 10) {
    const result = await this.prisma.donorProfile.groupBy({
      by: ['district'],
      where: { district: { not: null } },
      _count: true,
      orderBy: { _count: { district: 'desc' } },
      take: limit,
    });

    return result.map((r) => ({
      district: r.district,
      donorCount: r._count,
    }));
  }
}