import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./entity/user.entity";
import { TokenService } from "../auth/token.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [
    UserService,
    TokenService,
    JwtService
  ]
})
export class UserModule {}