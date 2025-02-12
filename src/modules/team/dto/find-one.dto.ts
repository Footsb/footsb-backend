import { ApiProperty } from "@nestjs/swagger";

import { TeamTypeEnum } from "src/common/eunm/team-type.enum";
import { ITeamDetail } from "../interface/team-detail";
import { GenderTypeEnum } from "src/common/eunm/gender-type.enum";
import { LevelTypeEnum } from "src/common/eunm/level-type.enum";

export class TeamDetailDto implements ITeamDetail {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '풋스비' })
  name: string;

  @ApiProperty({ type: String, example: '풋스비 축구단 간단 소개' })
  summary: string;

  @ApiProperty({ type: String, example: '풋스비 축구단 상세 소개' })
  description?: string | null;

  @ApiProperty({ type: String, example: 'https://thumbnail-image.jpeg' })
  thumbnailImage?: string | null;

  @ApiProperty({ type: Number, example: 3 })
  proCareerMembers: number;

  @ApiProperty({ type: Number, example: 100 })
  manner: number;

  @ApiProperty({ type: String, example: '월 수' })
  exerciseDays: string;

  @ApiProperty({ type: String, example: '12~18시' })
  exerciseTime: string;

  @ApiProperty({ type: String, example: '서울시 강남구' })
  exerciseAddress: string;

  @ApiProperty({ type: Boolean, example: true })
  isRecruitingMembers: boolean;

  @ApiProperty({ type: Number, example: 30 })
  maxMembers: number;

  @ApiProperty({ enum: TeamTypeEnum, enumName: 'TeamTypeEnum', example: 'FOOTBALL | FOOTSAL' })
  teamType: `${TeamTypeEnum}`;

  @ApiProperty({ enum: GenderTypeEnum, enumName: 'GenderTypeEnum', example: 'MALE | FEMALE | ANY' })
  genderType: `${GenderTypeEnum}`;

  @ApiProperty({ enum: LevelTypeEnum, enumName: 'LevelTypeEnum', example: '하하하 | 하하 | 하 | 중 | 중하 | 중상 | 상' })
  levelType: `${LevelTypeEnum}`;

  @ApiProperty({ type: String, example: '4-2-3-1' })
  formation: string;

  @ApiProperty({ type: String, example: '풋스비 축구단 회장 이름' })
  ownerName: string;

  @ApiProperty({ type: Number, example: 16 })
  memberCounts: number;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  updatedAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
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