import axios from 'axios';
import { DataSource, Repository } from 'typeorm';

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entity/user.entity';
import { JwtConfig } from 'src/config/config';

export type JwtPayload = {
  id: number;
  oAuthId: string;
}

@Injectable()
export class AuthService {
  private accessTokenSecret: string;
  private accessTokenExp: string;
  private refreshTokenSecret: string;
  private refreshTokenExp: string;
  
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    const {
      accessTokenSecret,
      accessTokenExp,
      refreshTokenSecret,
      refreshTokenExp,
    } = this.configService.get<JwtConfig>('jwtConfig');

    this.accessTokenSecret = accessTokenSecret;
    this.accessTokenExp = accessTokenExp;
    this.refreshTokenSecret = refreshTokenSecret;
    this.refreshTokenExp = refreshTokenExp;
  }
  
  async createAccessToken(payload: Record<string, any>): Promise<string> {
    try {
      return this.jwtService.signAsync(payload, {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExp,
      });
    } catch (err) {
      console.error('Failed to create AccessToken!', err);
    }
  }

  async createRefreshToken(payload: Record<string, any>): Promise<string> {
    try {
      return this.jwtService.signAsync(payload, {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExp,
      });
    } catch (err) {
      console.error('Failed to create RefreshToken!', err);
    }
  }

  async getKakaoAccessToken(authorizationCode: string) {
    try {
      const URL = 'https://kauth.kakao.com/oauth/token';
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('kakaoOatuh.clientId'),
        client_secret: this.configService.get<string>('kakaoOatuh.clientSecret'),
        code: authorizationCode,
        redirect_uri: this.configService.get<string>('kakaoOatuh.redirectUri'),
      });

      const { data } = await axios.post(
        URL,
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      return data['access_token'];
    } catch (err) {
      console.error('Failed to get Kakao AccessToken!', err);
      throw err;
    }
  }

  async getKakaoUserInfo(acessToken: string) {
    try {
      const URL = '	https://kapi.kakao.com/v2/user/me';
      const { data } = await axios.get(
        URL,
        {
          headers: {
            'Authorization': `Bearer ${acessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
        }
      );
      
      return data;
    } catch (err) {
      console.error('Failed to get Kakao OIDC token!', err);
      throw err;
    }
  }

  async getOrCreateUser(
    id: string,
    email: string,
    name: string,
    profileImage: string
  ): Promise<User>  {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const [ existingUser ] = await queryRunner.manager.query(`
        SELECT
          id,
          oAuthId
        FROM users
        WHERE email = ?
      `, [ email ]);
      
      if ( existingUser ) {
        await queryRunner.commitTransaction();
        return existingUser;
      }
      
      await queryRunner.manager.query(`
        INSERT INTO users (
          oAuthId,
          name,
          email,
          profileImage,
          oauthTypeId
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `, [ id, name, email, profileImage, 1 ]);
      
      const [ newUser ] = await queryRunner.manager.query(`
        SELECT
          id,  
          oAuthId
        FROM users
        WHERE oAuthId = ?
      `, [ id ]);
      
      await queryRunner.commitTransaction();
      return newUser;
    } catch(err) {
      await queryRunner.rollbackTransaction();
      console.error('Failed to get or create user!', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async oAuthKakaoLogin(authorizationCode: string) {
    try {
      const kakaoAccessToken = await this.getKakaoAccessToken(authorizationCode);
      const kakaoUser = await this.getKakaoUserInfo(kakaoAccessToken);
      
      const {
        id,
        properties: { nickname, profile_image: profileImage },
        kakao_account: { email }
        // kakao_account: { email, birthday, gender, age_range: ageRange }
      } = kakaoUser;
      
      const user = await this.getOrCreateUser(id, email, nickname, profileImage);
      
      const payload: JwtPayload = {
        id: user.id,
        oAuthId: user.oAuthId
      };

      const [ accessToken, refreshToken ] = await Promise.all([
        this.createAccessToken(payload),
        this.createRefreshToken(payload)
      ]);

      return { accessToken, refreshToken };
    } catch (err) {
      console.error('Failed to OAuth Login!', err);
      throw err;
    }
  }
}