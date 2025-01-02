import { GenderTypeEnum } from "src/common/eunm/gender-type.enum";
import { LevelTypeEnum } from "src/common/eunm/level-type.enum";
import { TeamTypeEnum } from "src/common/eunm/team-type.enum";

export interface ITeamDetail {
  id: number;
  name: string;
  summary: string;
  description?: string | null;
  thumbnailImage?: string | null;
  proCareerMembers: number;
  manner: number;
  exerciseDays: string;
  exerciseTime: string;
  exerciseAddress: string;
  isRecruitingMembers: boolean;
  maxMembers: number;
  teamType: `${TeamTypeEnum}`;
  genderType: `${GenderTypeEnum}`;
  levelType: `${LevelTypeEnum}`;
  formation: string;
  ownerName: string;
  memberCounts: number;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}