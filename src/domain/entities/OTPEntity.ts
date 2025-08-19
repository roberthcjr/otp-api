import type IOTPEntity from './IOTPEntity';

export default class OTPEntity implements IOTPEntity {
  constructor(public email: string, public secret: string) {}
}
