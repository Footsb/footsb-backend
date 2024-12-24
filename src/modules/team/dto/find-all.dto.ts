import { GenderTypeEnum } from 'src/common/eunm/gender-type.enum';
import { TeamTypeEnum } from 'src/common/eunm/team-type.enum';
import { ITeamList } from '../interface/team-list.interface';

export class TeamListDto implements ITeamList {
  id: number;
  name: string;
  exerciseDays: string;
  exerciseTime: string;
  memberCounts: number;
  maxMembers: number;
  isRecruitingMembers: boolean;
  teamType: `${TeamTypeEnum}`;
  genderType: `${GenderTypeEnum}`;
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
