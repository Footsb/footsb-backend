import { Controller, Get, Param } from '@nestjs/common';

import { TeamService } from './team.service';
import { TeamListDto } from './dto/find-all.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll(): Promise<TeamListDto[]> {
    return this.teamService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.teamService.findOne(id);
  }
}
