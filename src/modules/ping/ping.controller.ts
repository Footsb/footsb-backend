import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PingService } from './ping.service';
import { PingOutput } from './dto/ping.dto';
import { ResponseFormatInterceptor } from 'src/common/interceptor/http-response-format.interceptor';

@Controller('/ping')
@ApiTags('Health Check API')
@UseInterceptors(ResponseFormatInterceptor)
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  @ApiOperation({ summary: '백엔드 서버의 Health-check 목적API', description: '서버가 정상일 경우 pong을 반한한다.' })
  @ApiResponse({
    status: 200,
    description: '서버가 정상적으로 실행되고 있음.',
    type: PingOutput
  })
  @ApiResponse({
    status: 500,
    description: '서버 실행 상태가 불안정함',
  })
  ping(): PingOutput {
    return this.pingService.pong();
  }
}
