import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchDonorsDto } from './client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async searchDonors(query: SearchDonorsDto) {
    const { page = 1, limit = 10, bloodGroup, district, upazila, area } = query;
    const skip = (page - 1) * limit;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const users = await this.prisma.user.findMany({
      where: {
        userType: 'DONOR',
        isActive: true,
        bloodGroup: bloodGroup || undefined,
        profile: {
          isActive: true,
          district: district ? { contains: district } : undefined,
          upazila: upazila ? { contains: upazila } : undefined,
          area: area ? { contains: area } : undefined,
        },
        OR: [
          { lastDonationDate: null },
          { lastDonationDate: { lt: ninetyDaysAgo } },
        ],
      },
      include: { profile: true },
      skip,
      take: limit,
      orderBy: { lastDonationDate: 'asc' },
    });

    const total = await this.prisma.user.count({
      where: {
        userType: 'DONOR',
        isActive: true,
        bloodGroup: bloodGroup || undefined,
      },
    });

    return {
      data: users.map((user) => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        lastDonationDate: user.lastDonationDate,
        district: user.profile?.district,
        upazila: user.profile?.upazila,
        area: user.profile?.area,
        availableStatus: user.profile?.availableStatus,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async contactDonor(donorId: number, requesterId: number) {
    const donor = await this.prisma.user.findUnique({
      where: { id: donorId },
      include: { profile: true },
    });

    if (!donor || donor.userType !== 'DONOR') {
      throw new Error('Donor not found');
    }

    return {
      donorId: donor.id,
      name: donor.name,
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      availableStatus: donor.profile?.availableStatus,
    };
  }
}