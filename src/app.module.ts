// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { DiaryModule } from './diary/diary.module';
import { LocationModule } from './location/location.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PlaceModule } from './place/place.module';
import { JourneyModule } from './journey/journey.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateGroupModule } from './date-group/date-group.module';
import { DateGroupEntity } from './date-group/date-group.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    DiaryModule,
    LocationModule,
    ScheduleModule,
    PlaceModule,
    JourneyModule,
    DateGroupModule,
    TypeOrmModule.forRoot({
      entities: [DateGroupEntity],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
