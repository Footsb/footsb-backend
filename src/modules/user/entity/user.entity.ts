import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseCoreEntity } from 'src/common/entity/base.entity';
import { OAuthType } from './oauth.entity';
import { UserTeam } from 'src/modules/team/entity/user-team.entity';

@Entity('users')
export class User extends BaseCoreEntity {
  @Column({ length: 45 })
  name: string;

  @Column({ unique: true, length: 45 })
  email: string;

  @Column({ length: 45, nullable: true })
  password?: string;

  @Column({ length: 45 })
  phonenumber: string;

  @Column({ length: 45, nullable: true })
  profileImage: string;

  @ManyToOne(() => OAuthType)
  @JoinColumn()
  oauthType: number;

  @OneToMany(() => UserTeam, (userTeam) => userTeam.user)
  usersTeams: UserTeam[];
}
