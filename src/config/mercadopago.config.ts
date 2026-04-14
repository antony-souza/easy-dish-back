import { MercadoPagoConfig } from "mercadopago";
import { getEnvField } from "./env.config.js";

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: getEnvField.MERCADOPAGO_ACCESS_TOKEN,
});