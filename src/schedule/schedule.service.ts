import { Injectable, NotFoundException } from '@nestjs/common';
import { response } from 'src/response/response';
import { BaseResponse } from 'src/response/response.status';
import { LocationEntity } from 'src/location/location.entity';
import { ScheduleEntity } from './schedule.entity';
import { UpdateScheduleDto } from './dtos/update-schedule-dto';

@Injectable()
export class ScheduleService {
  //일정 작성하기
  async updateSchedule(scheduleId, updateScheduleDto) {
    const schedule = await ScheduleEntity.findExistSchedule(scheduleId);

    if (!updateScheduleDto.latitude || !updateScheduleDto.longitude) {
      await ScheduleEntity.updateScheduleTitle(schedule, updateScheduleDto);
    } else if (!updateScheduleDto.title) {
      await this.updateScheduleLocation(schedule, updateScheduleDto);
    } else {
      await this.updateScheduleLocation(schedule, updateScheduleDto);
      await ScheduleEntity.updateScheduleTitle(schedule, updateScheduleDto);
    }

    return response(BaseResponse.SCHEDULE_UPDATED);
  }

  async updateScheduleLocation(schedule, updateScheduleDto) {
    const existLocation = await LocationEntity.findExistLocation(
      updateScheduleDto,
    );
    if (existLocation) {
      await ScheduleEntity.updateScheduleLocation(schedule, existLocation);
    } else if (schedule.location) {
      const location = LocationEntity.updateLocation(
        schedule,
        updateScheduleDto,
      );
      console.log(location);
    } else {
      const location = await LocationEntity.createLocation(updateScheduleDto);
      await ScheduleEntity.updateScheduleLocation(schedule, location);
      console.log(location);
    }
  }
  //   const existLocation = LocationEntity.findExistLocation(updateScheduleDto);
  //   if (!existLocation) {
  //     if (!schedule.location) {
  //       const location = await LocationEntity.createLocation(updateScheduleDto);
  //       await ScheduleEntity.updateScheduleLocation(schedule, location);
  //       console.log(location);
  //     } else {
  //       const location = LocationEntity.updateLocation(
  //         schedule,
  //         updateScheduleDto,
  //       );
  //       console.log(location);
  //     }
  //   }
  //   await ScheduleEntity.updateScheduleLocation(schedule, existLocation);
  // }
}
