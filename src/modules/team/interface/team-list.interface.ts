import { TeamTypeEnum } from "src/common/eunm/team-type.enum";
import { GenderTypeEnum } from "src/common/eunm/gender-type.enum";

export interface ITeamList {
  id: number;
  name: string;
  exerciseDays: string;
  exerciseTime: string;
  maxMembers: number;
  isRecruitingMembers: boolean;
  createdAt: Date;
  teamType: `${TeamTypeEnum}`;
  genderType: `${GenderTypeEnum}`;
  memberCounts: number;
}
