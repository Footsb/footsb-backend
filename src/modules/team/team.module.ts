import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Team } from './entity/team.entity';
import { Formation } from './entity/formation.entity';
import { GenderType } from './entity/gender-type.entity';
import { LevelType } from './entity/level-type.entity';
import { TeamType } from './entity/team-type.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Team,
      Formation,
      GenderType,
      LevelType,
      TeamType,
      User,
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
