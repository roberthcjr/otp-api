export default interface IValidateOTP {
  execute(email: string, code: string): Promise<boolean>;
}
