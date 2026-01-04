export interface Birthday {
  id: string;
  name: string;
  day: number;
  month: number; // 1-12
  year?: number;
  notes?: string;
  giftIdea?: string; // New feature
}

export type Tab = 'home' | 'add' | 'list' | 'profile';

export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];