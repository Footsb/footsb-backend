import { Controller, Get, Param } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserProfile } from "./dto/user-profile.dto";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  // 액세스 토큰을 검증하는 가드 필요 (테스트 코드 추가 필요)
  @Get(':id')
  async getUserProfile(
    @Param('id') id: number
  ): Promise<UserProfile> {
    return this.userService.getUserProfile(id);
  }
}