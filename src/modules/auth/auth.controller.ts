import { Response } from "express";

import { Controller, Get, Query, Req, Res, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  
  @Get('/login/kakao')
  async oAuthLogin(
    @Query('code') query: string,
    @Res() res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.oAuthKakaoLogin(query);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    
    return res.json({ accessToken });
  }

  @Get('access-token')
  async generateAccessToken(
    @Req() req: Request
  ) {
    const { refreshToken } = req['cookies'];
    if (!refreshToken) throw new UnauthorizedException('Invalid RefreshToken!');

    return await this.authService.generateAccessToken(refreshToken);
  }
}