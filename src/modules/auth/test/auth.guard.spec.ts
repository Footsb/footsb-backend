import { Repository } from 'typeorm';

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { User } from 'src/modules/user/entity/user.entity';
import { AuthGuard } from '../guard/auth.guard'
import { TokenService } from '../token.service';

describe('🚀 AuthGuard', () => {
  let authGuard: AuthGuard;
  let tokenService: jest.Mocked<TokenService>;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    tokenService = {
      verifyAccessToken: jest.fn(),
    } as any;
    
    userRepository = {
      query: jest.fn(),
    } as any;
    
    authGuard = new AuthGuard(tokenService, userRepository);
  });

  test('📌 올바른 타입을 가진 유효한 액세스 토큰을 요청 받는 경우 AuthGuard는 true를 반환한다!', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer validToken' },
        }),
      }),
    } as ExecutionContext;
    
    tokenService.verifyAccessToken.mockResolvedValue({ userId: 1, oAuthId: 'oauth123' });
    userRepository.query.mockResolvedValue([{ id: 1 }]);
    
    const result = await authGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  test('📌 Request 헤더에 토큰 정보가 담겨있지 않으면 Unauthorization 예외를 반환한다!', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;
    
    
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Invalid Headers!')
    );
  });

  test('📌 Request 헤더에 담긴 토큰의 타입이나 형식이 유효하지 않은 경우 Unauthorization 예외를 반환한다!', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'invalid-type-token' },
        }),
      }),
    } as ExecutionContext;
    
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Invalid Authorization!')
    );
  });

  test('📌 토큰에 담긴 정보로 유저를 찾을 수 없는 경우 Unauthorization 예외를 반환한다!', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer validAccessToken' },
        }),
      }),
    } as ExecutionContext;
    
    tokenService.verifyAccessToken.mockResolvedValue({ userId: 1, oAuthId: 'oauth123' });
    userRepository.query.mockResolvedValue([]);
    
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException('Invalid User!')
    );
  });
})