import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const permissions = [
    { name: 'READ_ALL', description: 'Read all data' },
    { name: 'WRITE_ALL', description: 'Write all data' },
    { name: 'READ_ROLE', description: 'Read roles' },
    { name: 'WRITE_ROLE', description: 'Write roles' },
    { name: 'READ_USER', description: 'Read users' },
    { name: 'WRITE_USER', description: 'Write users' },
    { name: 'READ_DONOR', description: 'Read donors' },
    { name: 'WRITE_DONOR', description: 'Write donors' },
    { name: 'READ_CLIENT', description: 'Read clients' },
    { name: 'WRITE_CLIENT', description: 'Write clients' },
    { name: 'READ_PERMISSION', description: 'Read permissions' },
    { name: 'WRITE_PERMISSION', description: 'Write permissions' },
    { name: 'READ_DONATION', description: 'Read donations' },
    { name: 'WRITE_DONATION', description: 'Write donations' },
    { name: 'READ_STATISTICS', description: 'Read statistics' },
    { name: 'READ_LEADERBOARD', description: 'Read leaderboard' },
    { name: 'READ_SELF', description: 'Read own profile' },
    { name: 'WRITE_SELF', description: 'Write own profile' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }
  console.log('Permissions seeded');

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator with full access',
    },
  });

  const donorRole = await prisma.role.upsert({
    where: { name: 'DONOR' },
    update: {},
    create: {
      name: 'DONOR',
      description: 'Blood Donor role',
    },
  });

  const clientRole = await prisma.role.upsert({
    where: { name: 'CLIENT' },
    update: {},
    create: {
      name: 'CLIENT',
      description: 'Blood Seeker/Client role',
    },
  });

  const sudoAdminRole = await prisma.role.upsert({
    where: { name: 'SUDO_ADMIN' },
    update: {},
    create: {
      name: 'SUDO_ADMIN',
      description: 'Super Administrator with all permissions',
    },
  });

  const allPermissions = await prisma.permission.findMany();
  await prisma.role.update({
    where: { id: adminRole.id },
    data: { permissions: { connect: allPermissions.map((p) => ({ id: p.id })) } },
  });

  const donorPerms = await prisma.permission.findMany({
    where: { name: { in: ['READ_DONOR', 'WRITE_DONOR', 'READ_DONATION', 'WRITE_DONATION', 'READ_SELF', 'WRITE_SELF'] } },
  });
  await prisma.role.update({
    where: { id: donorRole.id },
    data: { permissions: { connect: donorPerms.map((p) => ({ id: p.id })) } },
  });

  const clientPerms = await prisma.permission.findMany({
    where: { name: { in: ['READ_DONOR', 'READ_CLIENT', 'READ_SELF', 'WRITE_SELF'] } },
  });
  await prisma.role.update({
    where: { id: clientRole.id },
    data: { permissions: { connect: clientPerms.map((p) => ({ id: p.id })) } },
  });

  await prisma.role.update({
    where: { id: sudoAdminRole.id },
    data: { permissions: { connect: allPermissions.map((p) => ({ id: p.id })) } },
  });

  console.log('Roles seeded with permissions');

  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@blood-donation.com' },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: 'admin@blood-donation.com',
        phone: '+8801700000000',
        password: hashedPassword,
        name: 'System Admin',
        userType: 'ADMIN',
        roleId: adminRole.id,
        isActive: true,
        isProfileComplete: true,
      },
    });
    console.log('Default admin created');
  } else {
    console.log('Admin already exists');
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
