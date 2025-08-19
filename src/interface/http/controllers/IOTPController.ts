export default interface IOTPController {
  create(email: string): Promise<string>;
  validate(email: string, code: string): Promise<boolean>;
}
