import { ApiProperty } from '@nestjs/swagger';

import { GenderTypeEnum } from 'src/common/eunm/gender-type.enum';
import { TeamTypeEnum } from 'src/common/eunm/team-type.enum';
import { ITeamList } from '../interface/team-list.interface';

export class TeamListDto implements ITeamList {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '풋스비' })
  name: string;

  @ApiProperty({ type: String, example: '월 수' })
  exerciseDays: string;

  @ApiProperty({ type: String, example: '12~18시' })
  exerciseTime: string;

  @ApiProperty({ type: Number, example: 16 })
  memberCounts: number;

  @ApiProperty({ type: Number, example: 30 })
  maxMembers: number;

  @ApiProperty({ type: Boolean, example: true })
  isRecruitingMembers: boolean;

  @ApiProperty({ enum: TeamTypeEnum, enumName: 'TeamTypeEnum', example: 'FOOTBALL | FOOTSAL' })
  teamType: `${TeamTypeEnum}`;

  @ApiProperty({ enum: GenderTypeEnum, enumName: 'GenderTypeEnum', example: 'MALE | FEMALE | ANY' })
  genderType: `${GenderTypeEnum}`;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  createdAt: Date;

  constructor(model: Record<string, any>) {
    this.id = parseInt(model['id'], 10);
    this.name = model['name'];
    this.exerciseDays = model['exerciseDays'];
    this.exerciseTime = model['exerciseTime'];
    this.memberCounts = model['memberCounts'];
    this.maxMembers = model['maxMembers'];
    this.isRecruitingMembers = !!model['isRecruitingMembers'];
    this.teamType = TeamTypeEnum[model['teamType']];
    this.genderType = GenderTypeEnum[model['genderType']];
    this.createdAt = model['createdAt'];
  }
}
