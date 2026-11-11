import type { SabitKiymet } from '../../../types/sabitKiymet.types';

export function hesaplaYillikAmortisman(
  alisBedeli: number,
  amortismanOrani: number,
): number {
  return (alisBedeli * amortismanOrani) / 100;
}


export function formatPara(deger: number): string {
  return deger.toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  });
}


export function formatTarih(tarih: string): string {
  return new Date(tarih).toLocaleDateString('tr-TR');
}

export function sabitKiymetOzeti(item: SabitKiymet): {
  yillikAmortisman: number;
  yillikAmortismanFormatted: string;
} {
  const yillikAmortisman = hesaplaYillikAmortisman(
    item.alisBedeli,
    item.amortismanOrani,
  );
  return {
    yillikAmortisman,
    yillikAmortismanFormatted: formatPara(yillikAmortisman),
  };
}