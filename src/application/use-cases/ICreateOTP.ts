export default interface ICreateOTP {
  execute(email: string): Promise<string>;
}
