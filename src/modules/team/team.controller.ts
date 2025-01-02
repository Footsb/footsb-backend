import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';

import { TeamService } from './team.service';
import { TeamListDto } from './dto/find-all.dto';
import { TeamDetailDto } from './dto/find-one.dto';
import { ResponseFormatInterceptor } from 'src/common/interceptor/http-response-format.interceptor';

@Controller('teams')
@UseInterceptors(ResponseFormatInterceptor)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll(): Promise<TeamListDto[]> {
    return this.teamService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<TeamDetailDto> {
    return this.teamService.findOne(id);
  }
}
