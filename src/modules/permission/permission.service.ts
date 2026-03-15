import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export const PERMISSIONS = {
  READ_ALL: 'READ_ALL',
  WRITE_ALL: 'WRITE_ALL',
  READ_USER: 'READ_USER',
  WRITE_USER: 'WRITE_USER',
  READ_DONOR: 'READ_DONOR',
  WRITE_DONOR: 'WRITE_DONOR',
  READ_CLIENT: 'READ_CLIENT',
  WRITE_CLIENT: 'WRITE_CLIENT',
  READ_ROLE: 'READ_ROLE',
  WRITE_ROLE: 'WRITE_ROLE',
  READ_PERMISSION: 'READ_PERMISSION',
  WRITE_PERMISSION: 'WRITE_PERMISSION',
  READ_DONATION: 'READ_DONATION',
  WRITE_DONATION: 'WRITE_DONATION',
  READ_STATISTICS: 'READ_STATISTICS',
  READ_LEADERBOARD: 'READ_LEADERBOARD',
} as const;

export type PermissionName = typeof PERMISSIONS[keyof typeof PERMISSIONS];

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findById(id: number) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async findByNames(names: string[]) {
    return this.prisma.permission.findMany({
      where: { name: { in: names } },
    });
  }

  async create(data: { name: string; description?: string }) {
    return this.prisma.permission.create({ data });
  }

  async seedPermissions() {
    const permissions = Object.values(PERMISSIONS);
    const created: string[] = [];

    for (const perm of permissions) {
      const existing = await this.prisma.permission.findUnique({
        where: { name: perm },
      });
      if (!existing) {
        await this.prisma.permission.create({
          data: { name: perm, description: `${perm} permission` },
        });
        created.push(perm);
      }
    }
    return created;
  }
}