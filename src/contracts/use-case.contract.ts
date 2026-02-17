import type { IApiResponse } from "../utils/api-response.js";

export interface IUseCase<TInput, TResponse> {
  handle(data: TInput): Promise<IApiResponse<TResponse>>;
}