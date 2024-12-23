import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { PingService } from './ping.service';
import { PingOutput } from './dto/ping.dto';
import { ResponseFormatInterceptor } from 'src/common/interceptor/http-response-format.interceptor';

@Controller('/api/ping')
@UseInterceptors(ResponseFormatInterceptor)
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  ping(): PingOutput {
    return this.pingService.pong();
  }
}