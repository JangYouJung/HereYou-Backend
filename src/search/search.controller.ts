// search.controller.ts

import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ResponseDto } from '../response/response.dto';
import { GetSearchMainDto } from './dto/get-search-main.dto';
import { ResponseCode } from '../response/response-code.enum';
import { CoverSignatureDto } from './dto/cover-signature.dto';
import { SearchService } from './search.service';
import { UserGuard } from '../user/user.guard';
import { Request } from 'express';

@Controller('search')
export class SearchController{

  constructor(private readonly searchService: SearchService) {}

  @Get('/') // 팀색탭 메인: 인기 급상승, 메이트의 최신 시그니처
  @UseGuards(UserGuard)
  async getSearchMain(
    @Req() req: Request,
  ): Promise<ResponseDto<GetSearchMainDto>>{
    try{
      const getSearchMainDto:GetSearchMainDto = new GetSearchMainDto();

      // [1] 인기 급상승 시그니처 가져오기
      const hotSignatures:CoverSignatureDto[] = await this.searchService.findHotSignatures();
      getSearchMainDto.hot = hotSignatures;

      // [2] 내가 팔로우하는 메이트들의 최신 시그니처 가져오기
      const newSignatures:CoverSignatureDto[] = await this.searchService.findMatesNewSignatures(req.user.id);
      getSearchMainDto.new = newSignatures;

      return new ResponseDto(
        ResponseCode.GET_SEARCH_MAIN_SUCCESS,
        true,
        "탐색탭 메인 화면 가져오기 성공",
        getSearchMainDto
      );
    }catch (error){
      console.log("탐색탭 메인 가져오기 실패: ", error);
      return new ResponseDto(
        ResponseCode.GET_SEARCH_MAIN_FAIL,
        false,
        "탐색탭 메인 화면 가져오기 실패",
        null
      );
    }
  }

  @Get('/find') // 탑색탭 검색: 키워드로 시그니처 검색하기
  async search(@Query('keyword') keyword: string): Promise<ResponseDto<CoverSignatureDto[]>> {
    try{

      const searchResult: CoverSignatureDto[] = await this.searchService.searchByKeyword(keyword);

      return new ResponseDto(
        ResponseCode.SEARCH_BY_KEYWORD_SUCCESS,
        true,
        "키워드로 검색하기 성공",
        searchResult
      );

    }catch(error){
      console.log("탑색- 키워드로 검색 실패: "+error);

      return new ResponseDto(
        ResponseCode.SEARCH_BY_KEYWORD_FAIL,
        false,
        "키워드로 검색하기 실패",
        null
      );
    }
  }

}
