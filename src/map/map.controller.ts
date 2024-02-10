import { MapService } from './map.service';
import { Controller, Param, Req, UseGuards, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/user/user.guard';
import { MonthInfoDto } from './month-info.dto';
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  /*월별 여정 불러오기*/
  @ApiOperation({
    summary: '월별 여정 불러오기',
    description: '월별 여정 리스트 - 제목, 날짜, 일지 개수를 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('get-monthly-journey/:year/:month')
  async getMonthlyJourney(
    @Param('year') year: number,
    @Param('month') month: number,
    @Req() req: Request,
  ) {
    const user = req.user;
    const monthInfoDto: MonthInfoDto = {
      year,
      month,
    };
    const result = await this.mapService.getMonthlyJourneyMap(
      user.id,
      monthInfoDto,
    );
    return result;
  }
  /*월별 일정 불러오기 -캘린더 */
  @ApiOperation({
    summary: '월별 일정 불러오기',
    description:
      '여정에 포함되는 일정, 위치, 세부 일정, 다이어리 유무를 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @UseGuards(UserGuard)
  @Get('get-monthly-schedule')
  async getMonthlySchedule(@Param('date') date: Date, @Req() req: Request) {
    const user = req.user;
    const result = await this.mapService.getMonthlySchedules(user.id, date);
    return result;
  }

  /*여정 불러오기*/
  @ApiOperation({
    summary: '여정 불러오기',
    description: '여정 제목, 날짜, 위치, 사진을 불러옵니다.',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Get('get-journey/:journeyId')
  async getJourneyPreview(@Param('journeyId') journeyId: number) {
    const result = await this.mapService.getJourneyPreview(journeyId);
    return result;
  }

  /*일지 불러오기 - 지도 */
  @ApiOperation({
    summary: '일지 불러오기 - 지도',
    description: 'journeyId로 일지 불러오기',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Get('get-diaries/:journeyId')
  async getDiaryList(@Param('journeyId') journeyId: number) {
    const result = await this.mapService.getDiaryList(journeyId);
    return result;
  }

  /*세부 여정 불러오기 - 지도 */
  @ApiOperation({
    summary: '세부 여정 불러오기 - 지도',
    description: 'journeyId로 일정 불러오기',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Get('get-schedules/:journeyId')
  async getDetailJourneyList(@Param('journeyId') journeyId: number) {
    const result = await this.mapService.getDetailJourneyList(journeyId);
    return result;
  }
}
