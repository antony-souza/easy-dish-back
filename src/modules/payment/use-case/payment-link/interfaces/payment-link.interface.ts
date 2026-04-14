export interface ICreatePaymentLinkData {
  id?: string;
  title: string;
  price: number;
  quantity?: number;
  pix?: boolean;
  payerEmail: string;
}

export interface ICreatePaymentLinkUseCaseResponse {
  id: string;
  paymentLink: string;
}