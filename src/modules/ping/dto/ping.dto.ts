import { ApiProperty } from "@nestjs/swagger";

export class PingOutput {
  @ApiProperty({ type: String, example: 'pong' })
  pong: string;
}
