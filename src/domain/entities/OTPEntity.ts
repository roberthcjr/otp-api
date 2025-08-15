export interface IOTPEntity {
  email: string;
  secret: string;
}

export class OTPEntity implements IOTPEntity {
  constructor(public email: string, public secret: string) {}
}
