import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { UserService } from "./user.service";
import { UserProfile } from "./dto/user-profile.dto";
import { AuthGuard, RequestUser } from "../auth/guard/auth.guard";

@Controller('users')
@ApiTags('User API')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}
  
  @ApiOperation({ summary: '접속 유저의 프로필 조회 API', description: '접속 유저의 액세스 토큰 검증 후 프로필 정보를 반환한다.' })
  @ApiResponse({
    status: 200,
    description: '유저 프로필을 반환합니다.',
    type: UserProfile
  })
  @Get('profiles')
  @UseGuards(AuthGuard)
  async getUserProfile(
    @Req() req: RequestUser
  ): Promise<UserProfile> {
    const { userId, oAuthId } = req;
    return await this.userService.getUserProfile(userId, oAuthId);
  }
}