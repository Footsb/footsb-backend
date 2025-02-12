import { ApiProperty } from "@nestjs/swagger";

export interface IUserProfile {
  id: number;
  name: string;
  email: string;
  oAuthId: string;
  oAuthType: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfile implements IUserProfile {
  @ApiProperty({ type: Number, example: 1 })
  id: number;
  
  @ApiProperty({ type: String, example: '풋스비' })
  name: string;
  
  @ApiProperty({ type: String, example: 'footsb-admin@footsb.com' })
  email: string;

  @ApiProperty({ type: String, example: '1234567890' })
  oAuthId: string;

  @ApiProperty({ type: String, example: 'KAKAO' })
  oAuthType: string;

  @ApiProperty({ type: String, example: 'https://image-url.jpeg' })
  profileImage: string;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2025-01-01' })
  updatedAt: Date;

  constructor(user: IUserProfile) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.oAuthId = user.oAuthId ?? null;
    this.oAuthType = user.oAuthType;
    this.profileImage = user.profileImage ?? null;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt ?? null;
  }
}