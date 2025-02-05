import { Repository } from "typeorm";

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { JwtDecoded, JwtPayload, TokenService } from "../token.service";
import { User } from "src/modules/user/entity/user.entity";

export type RequestUser = Partial<Request> & JwtPayload;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      
      const { authorization } = request.headers;
      if ( !authorization ) throw new UnauthorizedException('Invalid Headers!');
      
      const { userId, oAuthId } = await this.vaildateAccessToken(authorization);
      
      await this.validateUser(userId);
      
      request.userId = userId;
      request.oAuthId = oAuthId;
      
      return true;
    } catch (err) {
      console.error('[AuthGuard] Failed to validate access token!', err);
      throw new UnauthorizedException(err);
    }
  }

  async vaildateAccessToken(authorization: string): Promise<JwtDecoded> {
    try {
      const [ type, token ] = authorization.split(' ');
      if ( !type || !token ) throw new UnauthorizedException('Invalid Authorization!');
      
      const decoded = await this.tokenService.verifyAccessToken(token);
      const { userId , oAuthId } = decoded;
      if ( !userId || !oAuthId ) throw new UnauthorizedException('Invalid AccessToken!');
      
      return decoded;
    } catch (err) {
      throw err;
    }
  }

  async validateUser(userId: number): Promise<boolean> {
    try {
      const [ user ] = await this.userRepository.query(`
        SELECT id FROM users u WHERE u.id = ?
      `, [ userId ]);
      
      if ( !user ) throw new UnauthorizedException('Invalid User!');
      
      return true;
    } catch (err) {
      throw err;
    }
  }
}