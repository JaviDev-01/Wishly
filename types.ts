export type Category = 'Familia' | 'Amigos' | 'Trabajo' | 'Pareja' | 'Otros';

export interface Birthday {
  id: string;
  name: string;
  day: number;
  month: number; // 1-12
  year?: number;
  notes?: string;
  giftIdea?: string;
  category: Category;
}

export interface GiftIdea {
  id: string;
  name: string;
  description: string;
  link?: string;
  recipient: string;
  category: string;
}

export type Tab = 'home' | 'add' | 'list' | 'gifts' | 'profile';

export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];