import { Controller, Get, Req, UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserProfile } from "./dto/user-profile.dto";
import { AuthGuard, RequestUser } from "../auth/guard/auth.guard";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}
  
  @Get('profiles')
  @UseGuards(AuthGuard)
  async getUserProfile(
    @Req() req: RequestUser
  ): Promise<UserProfile> {
    const { userId, oAuthId } = req;
    return await this.userService.getUserProfile(userId, oAuthId);
  }
}