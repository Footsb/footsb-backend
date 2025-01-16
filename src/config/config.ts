import { AuthModule } from 'src/modules/auth/auth.module';
import { PingModule } from 'src/modules/ping/ping.module';
import { Formation } from 'src/modules/team/entity/formation.entity';
import { GenderType } from 'src/modules/team/entity/gender-type.entity';
import { LevelType } from 'src/modules/team/entity/level-type.entity';
import { TeamType } from 'src/modules/team/entity/team-type.entity';
import { Team } from 'src/modules/team/entity/team.entity';
import { UserTeam } from 'src/modules/team/entity/user-team.entity';
import { TeamModule } from 'src/modules/team/team.module';
import { OAuthType } from 'src/modules/user/entity/oauth.entity';
import { User } from 'src/modules/user/entity/user.entity';

export const ENTYTIES = [
  Team,
  Formation,
  GenderType,
  LevelType,
  TeamType,
  OAuthType,
  User,
  UserTeam,
];

export const MODULES = [
  PingModule,
  TeamModule,
  AuthModule
];

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type KakaoOauthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type JwtConfig = {
  accessTokenSecret: string;
  accessTokenExp: string;
  refreshTokenSecret: string;
  refreshTokenExp: string
}

export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
  kakaoOatuh: {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    redirectUri: process.env.KAKAO_REDIRECT_URI
  },
  jwtConfig: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExp: process.env.ACCESS_TOKEN_EXP,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExp: process.env.REFRESH_TOKEN_EXP,
  }
});
