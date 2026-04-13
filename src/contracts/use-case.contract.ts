import type { IApiResponse } from "../utils/api-response.js";

export interface IUseCase<TInput, TResponse> {
  handleWithId?(id: string, dto: TInput): Promise<IApiResponse<TResponse>>;
  handleWithIds?(ids: unknown, dto: TInput): Promise<IApiResponse<TResponse>>;
  handle?(data: TInput): Promise<IApiResponse<TResponse>>;
}