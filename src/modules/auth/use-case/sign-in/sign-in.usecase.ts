import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { ISignInSchema } from "./schemas/sign-in.schema.js";

export class SignInServiceUseCase implements IUseCase<ISignInSchema, void> {
  async handle(data: ISignInSchema): Promise<void> {
    return;
  }
}