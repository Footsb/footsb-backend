import { BadRequestException, Controller, Get, Query, Req } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  
  @Get('/login/kakao')
  async oAuthLogin(
    @Req() req: Request,
    @Query('code') query: string
  ) {
    return this.authService.oAuthKakaoLogin(query);
  }
}