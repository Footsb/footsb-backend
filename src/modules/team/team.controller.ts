import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TeamService } from './team.service';
import { TeamListDto } from './dto/find-all.dto';
import { TeamDetailDto } from './dto/find-one.dto';
import { ResponseFormatInterceptor } from 'src/common/interceptor/http-response-format.interceptor';

@Controller('teams')
@ApiTags('Team API')
@UseInterceptors(ResponseFormatInterceptor)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: '팀 목록 조회 API', description: '랜딩페이지에 접속할 때 모든 팀 목록을 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '팀 목록을 반환합니다.',
    type: TeamListDto
  })
  @Get()
  async findAll(): Promise<TeamListDto[]> {
    return this.teamService.findAll();
  }

  @ApiOperation({ summary: '팀 상세 조회 API', description: '팀의 세부 정보를 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '팀 상제 정보를 반환합니다.',
    type: TeamDetailDto
  })
  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<TeamDetailDto> {
    return this.teamService.findOne(id);
  }
}
