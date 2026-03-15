import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getTopDonors(limit = 50) {
    const donors = await this.prisma.donorProfile.findMany({
      where: { totalDonations: { gt: 0 } },
      include: {
        user: { select: { id: true, name: true, phone: true, bloodGroup: true } },
      },
      orderBy: { totalDonations: 'desc' },
      take: limit,
    });

    return donors.map((d, index) => ({
      rank: index + 1,
      name: d.user.name,
      phone: d.user.phone,
      bloodGroup: d.user.bloodGroup,
      totalDonations: d.totalDonations,
      badge: this.getBadge(d.totalDonations),
    }));
  }

  private getBadge(totalDonations: number): string {
    if (totalDonations >= 15) return 'GOLD';
    if (totalDonations >= 6) return 'SILVER';
    return 'BRONZE';
  }
}