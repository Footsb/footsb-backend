import { Column, Entity } from 'typeorm';

import { BaseCoreEntity } from 'src/common/entity/base.entity';
import { LevelTypeEnum } from 'src/common/eunm/level-type.enum';

@Entity('levelTypes')
export class LevelType extends BaseCoreEntity {
  @Column({ type: 'enum', enum: LevelTypeEnum })
  type: LevelTypeEnum;
}
