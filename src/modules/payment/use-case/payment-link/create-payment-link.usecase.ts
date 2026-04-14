import { Preference } from "mercadopago";
import { mercadoPagoClient } from "../../../../config/mercadopago.config.js";
import { getEnvField } from "../../../../config/env.config.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import type { ICreatePaymentLinkData, ICreatePaymentLinkUseCaseResponse } from "./interfaces/payment-link.interface.js";

export class CreatePaymentLinkUseCase implements IUseCase<ICreatePaymentLinkData, ICreatePaymentLinkUseCaseResponse> {
  private preference: Preference;

  constructor() {
    this.preference = new Preference(mercadoPagoClient);
  }

  async handle(data: ICreatePaymentLinkData): Promise<IApiResponse<ICreatePaymentLinkUseCaseResponse>> {
    try {
      const successUrl = getEnvField.MERCADOPAGO_BACK_URL_SUCCESS;
      const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const checkout = await this.preference.create({
        body: {
          items: [
            {
              id: data.id ?? data.title,
              title: data.title,
              quantity: data.quantity ?? 1,
              currency_id: "BRL",
              unit_price: data.price,
            },
          ],
          payer: {
            email: data.payerEmail,
          },
          back_urls: {
            success: successUrl,
            failure: getEnvField.MERCADOPAGO_BACK_URL_FAILURE,
            pending: getEnvField.MERCADOPAGO_BACK_URL_PENDING,
          },
          auto_return: "approved",
          notification_url: getEnvField.MERCADOPAGO_NOTIFICATION_URL,
          payment_methods: {
            excluded_payment_types: [],
            excluded_payment_methods: [],
            installments: 12,
          },
          date_of_expiration: expirationDate,
        },
      });

      if (!checkout.id || !checkout.init_point) {
        return {
          data: [],
          message: "Nao foi possivel criar a preferencia",
          statusCode: 502,
          errors: ["Resposta incompleta do Mercado Pago"],
        };
      }

      return {
        data: {
          id: checkout.id,
          paymentLink: checkout.init_point,
        },
        message: "Preferencia criada com sucesso",
        statusCode: 201,
        errors: [],
      };
    } catch (error: unknown) {
      const maybeError = error as { message?: string; cause?: { message?: string } };

      return {
        data: [],
        message: "Erro ao criar preferencia no Mercado Pago",
        statusCode: 400,
        errors: [
          maybeError?.message ?? maybeError?.cause?.message ?? "Erro inesperado no Mercado Pago",
        ],
      };
    }
  }
}