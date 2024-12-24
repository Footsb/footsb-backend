import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseCoreEntity } from 'src/common/entity/base.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Team } from './team.entity';

@Entity('usersTeams')
export class UserTeam extends BaseCoreEntity {
  @Column({ length: 10 })
  role: string;

  @Column({ length: 10 })
  userPosition: string;

  @Column({ nullable: true, default: false })
  isProCareer: boolean;

  @ManyToOne(() => User, (user) => user.usersTeams, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Team, (team) => team.usersTeams, { onDelete: 'CASCADE' })
  team: Team;
}
