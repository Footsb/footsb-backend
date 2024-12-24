import { Column, Entity } from 'typeorm';

import { BaseCoreEntity } from 'src/common/entity/base.entity';

@Entity('formations')
export class Formation extends BaseCoreEntity {
  @Column({ length: 10 })
  name: string;

  @Column({ length: 500, nullable: true })
  description?: string;
}
