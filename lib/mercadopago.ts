import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const PLANOS = { mensal: 97, anual: 797 } as const;

export const PACKS_IA = {
  pack10:  { creditos: 10,  preco: 5.00,  label: "10 imagens"  },
  pack30:  { creditos: 30,  preco: 12.00, label: "30 imagens"  },
  pack100: { creditos: 100, preco: 35.00, label: "100 imagens" },
} as const;
export type PackIAId = keyof typeof PACKS_IA;

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

export async function criarPreferenciaCreditos(pack: PackIAId, userId: string) {
  const { creditos, preco, label } = PACKS_IA[pack];
  const preference = new Preference(client);
  return await preference.create({
    body: {
      items: [
        {
          id: pack,
          title: `JIADVOCA — ${label} com IA`,
          description: `${creditos} créditos para gerar imagens com IA`,
          quantity: 1,
          unit_price: preco,
          currency_id: "BRL",
        },
      ],
      payment_methods: { installments: 1 },
      back_urls: {
        success: `${process.env.APP_URL}/gerar?ia=ok`,
        failure: `${process.env.APP_URL}/gerar?ia=erro`,
      },
      auto_return: "approved",
      external_reference: `${userId}|${pack}`,
      notification_url: `${process.env.APP_URL}/api/webhook/mp`,
    },
  });
}
