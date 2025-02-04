import { Test } from '@nestjs/testing';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserProfile } from '../dto/user-profile.dto';

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
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('📌 [GET] userProfile', () => {
    test('로그인한 유저의 프로필 정보를 조회할 수 있다!', async () => {
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
      const result = await userController.getUserProfile(1);
      
      expect(result).toEqual(mockUserProfile);
    });
  });
});
