import { Response } from "express";

import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";

import { AuthController } from "../auth.controller"
import { AuthService } from "../auth.service";

describe('🚀 AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            oAuthKakaoLogin: jest.fn(),
            generateAccessToken: jest.fn()
          }
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('📌 [GET] oAuthLogin', () => {
    test('카카오 소셜 로그인을 할 경우 refreshToken은 Cookie에 저장하고 acessToken을 반환한다!', async () => {
      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';
      const mockQueryParameter = 'testCode';
      
      jest.spyOn(authService, 'oAuthKakaoLogin').mockResolvedValue({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
      
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      
      await authController.oAuthLogin(mockQueryParameter, res);
      
      expect(authService.oAuthKakaoLogin).toHaveBeenCalledWith(mockQueryParameter);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', mockRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      expect(res.json).toHaveBeenCalledWith({ accessToken: mockAccessToken });
    });
  });

  describe('📌 [GET] generateAccessToken', () => {
    test('요청 객체의 Cookie에 refreshToken이 존재하면 액세스 토큰을 발급하는 AuthService 메서드를 호출하고 AccessToken을 발급할 수 있다!', async () => {
      const mockRefreshToken = 'mockRefreshToken';
      const mockNewAccessToken = 'newMockAccessToken';
      
      jest.spyOn(authService, 'generateAccessToken').mockResolvedValue({ accessToken: mockNewAccessToken });
      
      const req = { cookies: { refreshToken: mockRefreshToken } } as unknown as Request;
      
      const result = await authController.generateAccessToken(req);
      
      expect(authService.generateAccessToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(result).toEqual({ accessToken: mockNewAccessToken });
    });

    test('요청 객체의 Cookie에 refershToken이 존재하지 않으면 Unauthorization 예외를 반환한다!', async () => {
      const req = { cookies: {} } as unknown as Request;
      
      await expect(authController.generateAccessToken(req)).rejects.toThrow(
        new UnauthorizedException('Invalid RefreshToken!')
      );
    });
  });
})