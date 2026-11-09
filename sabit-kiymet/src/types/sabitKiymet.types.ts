
export enum Kategori {
  Bina = 'BINA',
  Tasit = 'TASIT',
  Demirbas = 'DEMIRBAS',
  Makine = 'MAKINE',
}

export const KATEGORI_LABEL: Record<Kategori, string> = {
  [Kategori.Bina]: 'Bina',
  [Kategori.Tasit]: 'Taşıt',
  [Kategori.Demirbas]: 'Demirbaş',
  [Kategori.Makine]: 'Makine',
};

export const KATEGORI_OPTIONS = Object.values(Kategori).map((value) => ({
  value,
  label: KATEGORI_LABEL[value],
}));


export enum Durum {
  Aktif = 'AKTIF',
  Satildi = 'SATILDI',
  Hurda = 'HURDA',
}

export const DURUM_LABEL: Record<Durum, string> = {
  [Durum.Aktif]: 'Aktif',
  [Durum.Satildi]: 'Satıldı',
  [Durum.Hurda]: 'Hurda',
};

export const DURUM_OPTIONS = Object.values(Durum).map((value) => ({
  value,
  label: DURUM_LABEL[value],
}));

export interface SabitKiymet {
  id: number;
  ad: string;
  kategori: Kategori;
  alisTarihi: string;
  alisBedeli: number;
  amortismanOrani: number;
  durum: Durum;
  subeId: number;
  subeAdi: string;
}