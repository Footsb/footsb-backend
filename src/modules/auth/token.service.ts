import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { JwtConfig } from "src/config/config";

export type JwtPayload = {
  userId: number;
  oAuthId: string;
}

export type JwtDecoded = JwtPayload;

@Injectable()
export class TokenService {
  private accessTokenSecret: string;
  private accessTokenExp: string;
  private refreshTokenSecret: string;
  private refreshTokenExp: string;
  
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const {
      accessTokenSecret, accessTokenExp,
      refreshTokenSecret, refreshTokenExp,
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

  async verifyAccessToken(token: string): Promise<JwtDecoded> {
    try {
      return this.jwtService.verify<JwtDecoded>(token, {
        secret: this.accessTokenSecret
      });
    } catch (err) {
      console.error('Failed to verify access token!', err);
      throw err;
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtDecoded> {
    try {
      return this.jwtService.verify<JwtDecoded>(token, {
        secret: this.refreshTokenSecret
      });
    } catch (err) {
      console.error('Failed to verify refresh token!', err);
      throw err;
    }
  }
}