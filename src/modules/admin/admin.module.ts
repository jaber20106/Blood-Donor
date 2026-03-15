import { Module } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsController } from './admin.controller';

@Module({
  providers: [AdminAnalyticsService],
  controllers: [AdminAnalyticsController],
  exports: [AdminAnalyticsService],
})
export class AdminModule {}