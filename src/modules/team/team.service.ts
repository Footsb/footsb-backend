import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Team } from './entity/team.entity';
import { TeamListDto } from './dto/find-all.dto';
import { TeamDetailDto } from './dto/find-one.dto';

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
        JOIN teamTypes tt   ON t.typeId = tt.id
        JOIN genderTypes gt ON t.genderTypeId = gt.id
        JOIN usersTeams ut  ON t.id = ut.teamId
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

  async findOne(teamId: number): Promise<TeamDetailDto> {
    try {
      const [team] = await this.teamRepository.query(`
        SELECT
          t.*,
          f.name  AS formation,
          tt.type AS teamType,
          lt.type AS levelType,
          gt.type AS genderType,
          u.name AS ownerName,
          COUNT(ut.userId) AS memberCounts
        FROM teams AS t
        JOIN teamTypes   AS tt ON t.typeId = tt.id
        JOIN genderTypes AS gt ON t.genderTypeId = gt.id
        JOIN levelTypes  AS lt ON t.levelTypeId = lt.id
        JOIN formations  AS f  ON t.formationId = f.id
        JOIN users       AS u  ON t.ownerId = u.id
        JOIN usersTeams  AS ut ON ut.teamId = ?
        WHERE t.id = ?;
      `, [ teamId, teamId ]);
      
      if (!team.id) {
        throw new NotFoundException('INVALID_TEAM');
      }
      
      return new TeamDetailDto(team);
    } catch (err) {
      console.log('Failed to get team by id!', err);
      throw err;
    }
  }
}
