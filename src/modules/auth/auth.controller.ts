import { Controller, Get, Query } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  
  @Get('/login/kakao')
  async oAuthLogin(
    @Query('code') query: string
  ) {
    return this.authService.oAuthKakaoLogin(query);
  }
}