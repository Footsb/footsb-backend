import { BaseCoreEntity } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('oauthTypes')
export class OAuthType extends BaseCoreEntity {
  @Column({ length: 10 })
  type: string;
}
