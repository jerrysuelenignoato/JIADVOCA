import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const PLANOS = { mensal: 97, anual: 797 } as const;

export async function criarPreferencia(
  plano: keyof typeof PLANOS,
  userId: string
) {
  const preference = new Preference(client);
  return await preference.create({
    body: {
      items: [
        {
          id: plano,
          title: `JIADVOCA — Plano ${plano.charAt(0).toUpperCase() + plano.slice(1)}`,
          quantity: 1,
          unit_price: PLANOS[plano],
          currency_id: "BRL",
        },
      ],
      payment_methods: { installments: 12 },
      back_urls: {
        success: `${process.env.APP_URL}/conta?status=success`,
        failure: `${process.env.APP_URL}/conta?status=failure`,
      },
      auto_return: "approved",
      external_reference: `${userId}|${plano}`,
      notification_url: `${process.env.APP_URL}/api/webhook/mp`,
    },
  });
}
