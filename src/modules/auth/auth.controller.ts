import { Response } from "express";

import { Controller, Get, Query, Req, Res, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";

@Controller('auth')
@ApiTags(' Auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  
  @ApiOperation({ summary: '카카오 소셜로그인 API', description: '카카오 소셜로그인에 성공할 경우 AccessToken을 반환하며, RefreshToken은 Cookies에 저장합니다.' })
  @ApiResponse({
    status: 200,
    description: '카카오 소셜로그인에 성공할 경우 AccessToken을 반환하며, RefreshToken은 Cookies에 저장합니다.'
  })
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

  @ApiOperation({ summary: 'AccessToken 재발급 API', description: 'Request객체의 cookies에 담긴 refreshTokne을 검증하여 accessToken을 재발급합니다.' })
  @ApiResponse({
    status: 200,
    description: '액세스 토큰을 반환합니다.'
  })
  @Get('access-token')
  async generateAccessToken(
    @Req() req: Request
  ) {
    const { refreshToken } = req['cookies'];
    if (!refreshToken) throw new UnauthorizedException('Invalid RefreshToken!');

    return await this.authService.generateAccessToken(refreshToken);
  }
}