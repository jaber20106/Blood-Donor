import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: true },
    });
  }

  async findById(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async findByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
      include: { permissions: true },
    });
  }

  async create(data: { name: string; description?: string; permissionIds?: number[] }) {
    const role = await this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: data.permissionIds
          ? { connect: data.permissionIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { permissions: true },
    });
    return role;
  }

  async update(id: number, data: { description?: string; permissionIds?: number[]; isActive?: boolean }) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

    const updateData: any = { ...data };
    if (data.permissionIds) {
      updateData.permissions = {
        set: data.permissionIds.map((id) => ({ id })),
      };
    }

    return this.prisma.role.update({
      where: { id },
      data: updateData,
      include: { permissions: true },
    });
  }

  async delete(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return this.prisma.role.delete({ where: { id } });
  }

  async seedDefaultRoles() {
    const adminRole = await this.prisma.role.findUnique({ where: { name: 'ADMIN' } });
    if (!adminRole) {
      const allPerms = await this.prisma.permission.findMany();
      await this.prisma.role.create({
        data: {
          name: 'ADMIN',
          description: 'Administrator with full access',
          permissions: { connect: allPerms.map((p) => ({ id: p.id })) },
        },
      });
    }

    const donorRole = await this.prisma.role.findUnique({ where: { name: 'DONOR' } });
    if (!donorRole) {
      const donorPerms = await this.prisma.permission.findMany({
        where: {
          name: {
            in: ['READ_DONOR', 'WRITE_DONOR', 'READ_DONATION', 'WRITE_DONATION'],
          },
        },
      });
      await this.prisma.role.create({
        data: {
          name: 'DONOR',
          description: 'Blood Donor role',
          permissions: { connect: donorPerms.map((p) => ({ id: p.id })) },
        },
      });
    }

    const clientRole = await this.prisma.role.findUnique({ where: { name: 'CLIENT' } });
    if (!clientRole) {
      const clientPerms = await this.prisma.permission.findMany({
        where: { name: { in: ['READ_DONOR', 'READ_CLIENT'] } },
      });
      await this.prisma.role.create({
        data: {
          name: 'CLIENT',
          description: 'Blood Seeker/Client role',
          permissions: { connect: clientPerms.map((p) => ({ id: p.id })) },
        },
      });
    }
    return { message: 'Default roles seeded' };
  }
}