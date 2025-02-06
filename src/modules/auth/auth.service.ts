import axios from 'axios';
import { DataSource, Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entity/user.entity';
import { JwtPayload, TokenService } from './token.service';
import { AccessTokenDto, LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }
  
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

  async oAuthKakaoLogin(authorizationCode: string): Promise<LoginDto> {
    try {
      const kakaoAccessToken = await this.getKakaoAccessToken(authorizationCode);
      const kakaoUser = await this.getKakaoUserInfo(kakaoAccessToken);
      
      const {
        id,
        properties: { nickname, profile_image: profileImage },
        kakao_account: { email }
      } = kakaoUser;
      
      const user = await this.getOrCreateUser(id, email, nickname, profileImage);
      
      const payload: JwtPayload = {
        userId: user.id,
        oAuthId: user.oAuthId
      };

      const [ accessToken, refreshToken ] = await Promise.all([
        this.tokenService.createAccessToken(payload),
        this.tokenService.createRefreshToken(payload)
      ]);

      return { accessToken, refreshToken };
    } catch (err) {
      console.error('Failed to OAuth Login!', err);
      throw err;
    }
  }

  async generateAccessToken(_refreshToken: string): Promise<AccessTokenDto> {
    try {
      const refreshTokenDecoded = await this.tokenService.verifyRefreshToken(_refreshToken);
      const { userId, oAuthId } = refreshTokenDecoded;
      
      if (!userId || !oAuthId) throw new UnauthorizedException('Invalid Payload!');
      
      const [ user ] = await this.userRepository.query(`
        SELECT
          u.id
        FROM users u
        WHERE u.id = ? AND u.oAuthId = ?
      `, [ userId, oAuthId ]);
      if (!user) throw new UnauthorizedException('Invalid User!');
      
      const payload = { userId, oAuthId };
      const accessToken = await this.tokenService.createAccessToken(payload);
      
      return { accessToken };
    } catch (err) {
      console.error('Failed to generate AccessToken!', err);
      throw err;
    }
  }
}