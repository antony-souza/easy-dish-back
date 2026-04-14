import { Preference } from "mercadopago";
import { mercadoPagoClient } from "../../../../config/mercadopago.config.js";
import { getEnvField } from "../../../../config/env.config.js";
import type { ICreatePreferenceData, ICreatePreferenceUseCaseResponse } from "./interfaces/preference.interface.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";

export class CreatePreferenceUseCase implements IUseCase<ICreatePreferenceData, ICreatePreferenceUseCaseResponse> {
  private preference: Preference;

  constructor() {
    this.preference = new Preference(mercadoPagoClient);
  }

  async handle(data: ICreatePreferenceData): Promise<IApiResponse<ICreatePreferenceUseCaseResponse>> {
    try {
      const successUrl = getEnvField.MERCADOPAGO_BACK_URL_SUCCESS;

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
            email: data.email,
          },
          back_urls: {
            success: successUrl,
            failure: getEnvField.MERCADOPAGO_BACK_URL_FAILURE,
            pending: getEnvField.MERCADOPAGO_BACK_URL_PENDING,
          },
          auto_return: "approved",
          notification_url: getEnvField.MERCADOPAGO_NOTIFICATION_URL,
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
          initPoint: checkout.init_point,
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