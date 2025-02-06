import axios from "axios";
import { DataSource, Repository } from "typeorm";

import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../auth.service"
import { AuthController } from "../auth.controller";
import { TokenService } from "../token.service";
import { User } from "src/modules/user/entity/user.entity";

// axios 모킹
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('🚀 AuthService', () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let configService: ConfigService;
  let userRepository: MockRepository<User>;
  let dataSource: DataSource;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: {
            createAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn()
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                query: jest.fn()
              }
            })
          }
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            query: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                'kakaoOatuh.clientId': 'mock-client-id',
                'kakaoOatuh.clientSecret': 'mock-client-secret',
                'kakaoOatuh.redirectUri': 'mock-redirect-uri'
              };
              return config[key];
            })
          }
        }
      ]
    }).compile();
    
    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    configService = module.get<ConfigService>(ConfigService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    dataSource = module.get(DataSource);
  });

  describe('📌 getKakaoAccessToken', () => {
    test('카카오 액세스 토큰을 발급 받을 수 있다!', async () => {
      const mockKakaoAccessToken = 'mock-kakao-access-token'
      
      mockedAxios.post.mockResolvedValueOnce({ 
        data: { access_token: mockKakaoAccessToken } 
      });
      
      const result = await authService.getKakaoAccessToken('authorizationCode');
      
      expect(result).toBe(mockKakaoAccessToken);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://kauth.kakao.com/oauth/token',
        expect.any(String),
        expect.any(Object)
      );
    });

    test('카카오 액세스 토큰을 발급받지 못할 경우 에러를 반환한다!', async () => {
      const error = new Error('Kakao API Error');
      mockedAxios.post.mockRejectedValueOnce(error);
      
      await expect(authService.getKakaoAccessToken('auth-code'))
        .rejects.toThrow(error);
    });
  });

  describe('📌 getKakaoUserInfo', () => {
    const mockKakaoUserInfo = {
      id: '3881916410',
      properties: {
        nickname: 'Test User',
        profile_image: 'http://example.com/profile.jpg'
      },
      kakao_account: {
        email: 'test@example.com'
      }
    };
    const mockKakaoAccessToken = 'mock-access-token';

    test('카카오 액세스 토큰을 통해 카카오 유저 정보를 조회할 수 있다!', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockKakaoUserInfo });
      
      const result = await authService.getKakaoUserInfo(mockKakaoAccessToken);
      expect(result).toEqual(mockKakaoUserInfo);
    });

    it('카카오 유저 정보 조회에 실패할 경우 에러를 반환한다!', async () => {
      const error = new Error('Kakao API Error');
      mockedAxios.get.mockRejectedValueOnce(error);
      
      await expect(authService.getKakaoUserInfo(mockKakaoAccessToken))
        .rejects.toThrow(error);
    });
  });

  describe('📌 getOrCreateUser', () => {
    const mockKakaoOAuthId = '1234567890';
    const mockKakaoUserInfo = {
      kakao_account: { email: 'test@email.com' },
      properties: {
        nickname: 'Test User',
        profile_image: 'http://example.com/profile.jpg'
      }
    };
    const mockUser = { id: 1, oAuthId: '1234567890' };

    test('카카오 유저ID 값으로 가입된 계정 정보가 있을 경우 해당 유저 정보를 반환한다!', async () => {
      const mockQueryRunner = dataSource.createQueryRunner();      
      jest.spyOn(mockQueryRunner.manager, 'query')
        .mockResolvedValueOnce([mockUser]);
        
      const result = await authService.getOrCreateUser(
        mockKakaoOAuthId,
        mockKakaoUserInfo.kakao_account.email,
        mockKakaoUserInfo.properties.nickname,
        mockKakaoUserInfo.properties.profile_image
      );
      
      expect(result).toEqual(mockUser);
      expect(mockQueryRunner.manager.query).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    test('카카오 유저ID 값으로 가입된 계정 정보가 없을 경우 해당 유저 정보로 새 유저 데이터를 생성하고 해당 유저 정보를 반환한다!', async () => {
      const mockQueryRunner = dataSource.createQueryRunner();      
      jest.spyOn(mockQueryRunner.manager, 'query')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockUser]);
        
      const result = await authService.getOrCreateUser(
        mockKakaoOAuthId,
        mockKakaoUserInfo.kakao_account.email,
        mockKakaoUserInfo.properties.nickname,
        mockKakaoUserInfo.properties.profile_image
      );
      
      expect(result).toEqual(mockUser);
      expect(mockQueryRunner.manager.query).toHaveBeenCalledTimes(3);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  })

  describe('📌 generateAccessToken', () => {
    test('refreshToken과 유저가 검증되면 액세스 토큰을 정상적으로 발행할 수 있다!', async () => {
      const mockRefreshToken = 'mockRefreshToken';
      const mockDecodedToken = { userId: 1, oAuthId: '1234567890' };
      const mockAccessToken = 'newAccessToken';
      
      jest.spyOn(tokenService, 'verifyRefreshToken').mockResolvedValue(mockDecodedToken);
      jest.spyOn(userRepository, 'query').mockResolvedValue([{ id: 1 }]);
      jest.spyOn(tokenService, 'createAccessToken').mockResolvedValue(mockAccessToken);
      
      const result = await authService.generateAccessToken(mockRefreshToken);
      
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(tokenService.createAccessToken).toHaveBeenCalledWith({ userId: 1, oAuthId: '1234567890' });
      expect(result).toEqual({ accessToken: mockAccessToken });
    });
    
    test('refreshToken이 유효하지 않거나 만료된 경우 Unauthorization 예외를 반환한다!', async () => {
      const mockRefreshToken = 'invalidToken';
      
      jest.spyOn(tokenService, 'verifyRefreshToken').mockRejectedValue(new UnauthorizedException('Invalid Token'));
      
      await expect(authService.generateAccessToken(mockRefreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid Token')
      );
      
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(userRepository.query).not.toHaveBeenCalled();
      expect(tokenService.createAccessToken).not.toHaveBeenCalled();
    });
    
    test('유저 정보가 유효하지 않거나 존재하지 않은 경우 Unauthorization 예외를 반환한다!', async () => {
      const mockRefreshToken = 'mockRefreshToken';
      const mockDecodedToken = { userId: 1, oAuthId: 'oauth123' };
      
      jest.spyOn(tokenService, 'verifyRefreshToken').mockResolvedValue(mockDecodedToken);
      jest.spyOn(userRepository, 'query').mockResolvedValue([]);
      
      await expect(authService.generateAccessToken(mockRefreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid User!')
      );
      
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(tokenService.createAccessToken).not.toHaveBeenCalled();
    });
  });
})