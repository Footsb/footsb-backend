import { Entity, Column } from 'typeorm';

import { BaseCoreEntity } from 'src/common/entity/base.entity';
import { TeamTypeEnum } from 'src/common/eunm/team-type.enum';

@Entity('teamTypes')
export class TeamType extends BaseCoreEntity {
  @Column({ type: 'enum', enum: TeamTypeEnum })
  type: TeamTypeEnum;
}
