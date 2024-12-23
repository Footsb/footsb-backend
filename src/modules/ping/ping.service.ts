import { Injectable } from '@nestjs/common';

import { PingOutput } from './dto/ping.dto';

@Injectable()
export class PingService {
  pong(): PingOutput {
    return { pong: 'pong' };
  }
}