import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, phone, bloodGroup, userType, district, upazila, area } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (phone) where.phone = { contains: phone };
    if (bloodGroup) where.bloodGroup = bloodGroup;
    if (userType) where.userType = userType;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
          profile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const filteredUsers = users.filter((user) => {
      if (district || upazila || area) {
        const profile = user.profile;
        if (district && profile?.district !== district) return false;
        if (upazila && profile?.upazila !== upazila) return false;
        if (area && profile?.area !== area) return false;
      }
      return true;
    });

    return {
      data: filteredUsers.map((u) => this.sanitizeUser(u)),
      meta: {
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, profile: true, donations: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (existing) throw new BadRequestException('User with this email or phone exists');

    const hashedPassword = await this.hashPassword(dto.password);
    let roleId = dto.roleId;

    if (!roleId && dto.userType) {
      const role = await this.prisma.role.findUnique({ where: { name: dto.userType } });
      roleId = role?.id;
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
        bloodGroup: dto.bloodGroup,
        userType: dto.userType || 'DONOR',
        roleId,
        gender: dto.gender,
        lastDonationDate: dto.lastDonationDate,
      },
      include: { role: true },
    });

    if (dto.userType === 'DONOR') {
      await this.prisma.donorProfile.create({
        data: { userId: user.id, mobile: dto.phone },
      });
    }

    return this.sanitizeUser(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.bloodGroup) updateData.bloodGroup = dto.bloodGroup;
    if (dto.gender) updateData.gender = dto.gender;
    if (dto.lastDonationDate) updateData.lastDonationDate = dto.lastDonationDate;
    if (dto.roleId) updateData.roleId = dto.roleId;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.isProfileComplete !== undefined) updateData.isProfileComplete = dto.isProfileComplete;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true, profile: true },
    });
  }

  async disable(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, profile: true, donations: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: number, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: userId },
      data: { ...data, isProfileComplete: true },
    });

    if (user.userType === 'DONOR') {
      await this.prisma.donorProfile.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
      });
    }

    return this.getProfile(userId);
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    return bcrypt.hash(password, 10);
  }

  private sanitizeUser(user: any) {
    const { password, refreshToken, refreshTokenExp, ...result } = user;
    return result;
  }
}