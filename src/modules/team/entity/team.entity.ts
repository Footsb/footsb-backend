import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseCoreEntity } from 'src/common/entity/base.entity';
import { TeamType } from './team-type.entity';
import { GenderType } from './gender-type.entity';
import { LevelType } from './level-type.entity';
import { Formation } from './formation.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { UserTeam } from './user-team.entity';

@Entity('teams')
export class Team extends BaseCoreEntity {
  @Column({ length: 25 })
  name: string;

  @Column({ length: 100 })
  summary: string;

  @Column({ length: 3000, nullable: true, default: null })
  description?: string;

  @Column({ length: 25, nullable: true, default: null })
  thumbnailImage?: string;

  @Column({ nullable: true, default: 0 })
  proCareerMembers?: number;

  @Column({ nullable: true, default: 100 })
  manner?: number;

  @Column({ length: 25 })
  exerciseDays: string;

  @Column({ length: 25 })
  exerciseTime: string;

  @Column({ length: 25 })
  exerciseAddress: string;

  @Column({ nullable: true, default: false })
  isRecruitingMembers?: boolean;

  @Column({ default: 30 })
  maxMembers: number;

  @ManyToOne((_type) => TeamType)
  @JoinColumn()
  type: number;

  @ManyToOne((_type) => GenderType)
  @JoinColumn()
  genderType: number;

  @ManyToOne((_type) => LevelType)
  @JoinColumn()
  levelType: number;

  @ManyToOne((_type) => Formation)
  @JoinColumn()
  formation: number;

  @ManyToOne((_type) => User)
  @JoinColumn()
  owner: number;

  @OneToMany(() => UserTeam, (userTeam) => userTeam.team)
  usersTeams: UserTeam[];
}
