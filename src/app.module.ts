import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { DonorModule } from './modules/donor/donor.module';
import { ClientModule } from './modules/client/client.module';
import { DonationModule } from './modules/donation/donation.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    DonorModule,
    ClientModule,
    DonationModule,
    StatisticsModule,
    LeaderboardModule,
    AdminModule,
  ],
})
export class AppModule {}