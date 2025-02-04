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
  id: number;
  name: string;
  email: string;
  oAuthId: string;
  oAuthType: string;
  profileImage: string;
  createdAt: Date;
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