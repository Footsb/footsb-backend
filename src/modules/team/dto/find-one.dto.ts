import { TeamTypeEnum } from "src/common/eunm/team-type.enum";
import { ITeamDetail } from "../interface/team-detail";
import { GenderTypeEnum } from "src/common/eunm/gender-type.enum";
import { LevelTypeEnum } from "src/common/eunm/level-type.enum";

export class TeamDetailDto implements ITeamDetail {
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
  updatedAt: Date;
  deletedAt?: Date;

    constructor(model: Record<string, any>) {
      this.id = parseInt(model['id'], 10);
      this.ownerName = model['ownerName'];
      this.name = model['name'];
      this.summary = model['summary'];
      this.description = model['description'] ?? null;
      this.thumbnailImage = model['thumbnailImage'] ?? null;
      this.proCareerMembers = model['proCareerMembers'];
      this.manner = model['manner'];
      this.exerciseDays = model['exerciseDays'];
      this.exerciseTime = model['exerciseTime'];
      this.exerciseAddress = model['exerciseAddress'];
      this.memberCounts = parseInt(model['memberCounts'], 10);
      this.maxMembers = model['maxMembers'];
      this.formation = model['formation'];
      this.isRecruitingMembers = !!model['isRecruitingMembers'];
      this.teamType = TeamTypeEnum[model['teamType']];
      this.genderType = GenderTypeEnum[model['genderType']];
      this.levelType = LevelTypeEnum[model['levelType']];
      this.createdAt = model['createdAt'];
      this.updatedAt = model['updatedAt'] ?? null;
      this.deletedAt = model['deletedAt'] ?? null;
    }
}