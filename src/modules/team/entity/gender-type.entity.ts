import { Entity, Column } from 'typeorm';

import { BaseCoreEntity } from 'src/common/entity/base.entity';
import { GenderTypeEnum } from 'src/common/eunm/gender-type.enum';

@Entity('genderTypes')
export class GenderType extends BaseCoreEntity {
  @Column({ type: 'enum', enum: GenderTypeEnum })
  type: GenderTypeEnum;
}
