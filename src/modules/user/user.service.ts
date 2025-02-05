import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "./entity/user.entity";
import { UserProfile } from "./dto/user-profile.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async getUserProfile(userId: number, oAuthId: string): Promise<UserProfile> {
    try {
      const [ user ] = await this.userRepository.query(`
        SELECT
          u.id,
          u.name,
          u.email,
          u.oAuthId,
          u.profileImage,
          u.createdAt,
          u.updatedAt,
          o.type AS oAuthType
        FROM users AS u
        JOIN oauthTypes AS o ON o.id = u.oauthTypeId
        WHERE u.id = ? AND u.oAuthId = ?
      `, [ userId, oAuthId ]);
      
      return new UserProfile(user);
    } catch(err) {
      console.error('Failed to get user profile!', err);
      throw err;
    }
  }
}