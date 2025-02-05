import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "../user/entity/user.entity";
import { TokenService } from "./token.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    ConfigService,
    JwtService,
  ],
  exports: [TokenService]
})
export class AuthModule{}