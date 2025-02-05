import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserProfile } from '../dto/user-profile.dto';
import { RequestUser } from 'src/modules/auth/guard/auth.guard';
import { TokenService } from 'src/modules/auth/token.service';
import { User } from '../entity/user.entity';

describe('🚀 UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserProfile: jest.fn()
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              accessTokenSecret: 'access-token-secret',
              accessTokenExp: 'access-token-exp',
              refreshTokenSecret: 'refresh-token-secret',
              refreshTokenExp: 'refresh-token-exp',
            }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            query: jest.fn()
          }
        },
        TokenService,
        JwtService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('📌 [GET] userProfile', () => {
    test('로그인한 유저의 프로필 정보를 조회할 수 있다!', async () => {
      const mockReq: RequestUser = {
        userId: 1,
        oAuthId: "3881916410"
      }
      const mockUserProfile: UserProfile = {
        id: 1,
        name: "풋스비",
        email: "can7063@hanmail.net",
        oAuthId: "3881916410",
        oAuthType: "KAKAO",
        profileImage: "http://k.kakaocdn.net/dn/test/test/img_640x640.jpg",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01")
      };
      
      jest.spyOn(userService, 'getUserProfile').mockResolvedValue(mockUserProfile);
      const result = await userController.getUserProfile(mockReq);
      
      expect(result).toEqual(mockUserProfile);
    });
  });
});
