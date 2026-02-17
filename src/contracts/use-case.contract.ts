export interface IUseCase<TInput, TOutput> {
  handle(data: TInput): Promise<TOutput>;
}