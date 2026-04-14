export interface ICreatePreferenceData {
  id?: string;
  title: string;
  price: number;
  quantity?: number;
  pix?: boolean;
  email: string;
}

export interface ICreatePreferenceUseCaseResponse {
  initPoint: string;
  id: string;
}