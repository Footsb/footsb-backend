import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Team } from './entity/team.entity';
import { TeamListDto } from './dto/find-all.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<TeamListDto[]> {
    try {
      const teams = await this.teamRepository.query(`
        SELECT
          t.id,
          t.name,
          t.exerciseDays,
          t.exerciseTime,
          t.maxMembers,
          t.isRecruitingMembers,
          t.createdAt,
          tt.type as teamType,
          gt.type as genderType,
          COUNT (ut.userId) as memberCounts
        FROM teams t
        LEFT JOIN teamTypes tt   ON t.typeId = tt.id
        LEFT JOIN genderTypes gt ON t.genderTypeId = gt.id
        LEFT JOIN usersTeams ut  ON t.id = ut.teamId
        GROUP BY
          t.id,
          t.name,
          t.exerciseDays,
          t.exerciseTime,
          t.maxMembers,
          t.isRecruitingMembers,
          t.createdAt,
          tt.type,
          gt.type;
      `);
      
      return teams.map((team) => new TeamListDto(team));
    } catch (err) {
      console.log('Failed to get teams!', err);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
    } catch (err) {
      console.log('Failed to get team by id!', err);
      throw err;
    }
  }
}
