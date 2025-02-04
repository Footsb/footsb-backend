import { Repository } from "typeorm";

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UserService } from "../user.service";
import { User } from "../entity/user.entity";
import { UserProfile } from "../dto/user-profile.dto";

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('🚀 UserService', () => {
  let userService: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            query: jest.fn()
          }
        }
      ]
    }).compile();
    
    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  describe('📌 getUserProfile', () => {
    test('로그인한 유저의 프로필 정보를 조회할 수 있다!', async () => {
      const mockResponse = [
        {
          id: 1,
          name: "풋스비",
          email: "can7063@hanmail.net",
          oAuthId: "3881916410",
          oAuthType: "KAKAO",
          profileImage: "http://k.kakaocdn.net/dn/test/test/img_640x640.jpg",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01")
        }
      ];
      
      jest.spyOn(userRepository, 'query').mockResolvedValue(mockResponse);
      
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
      
      const result = await userService.getUserProfile(1);
      expect(result).toEqual(mockUserProfile);
    });
  });
});