import { Birthday } from './types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getDaysUntilBirthday = (day: number, month: number): { days: number; age?: number } => {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  let nextBirthday = new Date(currentYear, month - 1, day);
  
  today.setHours(0, 0, 0, 0);
  nextBirthday.setHours(0, 0, 0, 0);

  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  const diffTime = Math.abs(nextBirthday.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return { days: diffDays };
};

export const calculateAgeDetails = (day: number, month: number, year: number) => {
    const now = new Date();
    const birthDate = new Date(year, month - 1, day);
    
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();

    // Adjust negative values
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        // Get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    return { years, months, days, hours, minutes, seconds };
};

export const sortBirthdays = (birthdays: Birthday[]): Birthday[] => {
  return [...birthdays].sort((a, b) => {
    const daysA = getDaysUntilBirthday(a.day, a.month).days;
    const daysB = getDaysUntilBirthday(b.day, b.month).days;
    return daysA - daysB;
  });
};

export const getZodiacData = (day: number, month: number): { sign: string, trait: string } => {
  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) return { sign: "Capricornio ♑", trait: "El jefe del barrio. Ambicioso pero terco." };
  if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) return { sign: "Acuario ♒", trait: "Vive en el 3025. Raro pero genial." };
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return { sign: "Piscis ♓", trait: "Drama queen profesional. Corazón de oro." };
  if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) return { sign: "Aries ♈", trait: "Primero en todo. Cero paciencia." };
  if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) return { sign: "Tauro ♉", trait: "Le gusta comer y dormir. No lo muevas." };
  if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return { sign: "Géminis ♊", trait: "Tiene dos caras y ambas hablan mucho." };
  if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return { sign: "Cáncer ♋", trait: "Llora con anuncios de pañales. Protector." };
  if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) return { sign: "Leo ♌", trait: "El prota de la peli. Brilla (y lo sabe)." };
  if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) return { sign: "Virgo ♍", trait: "Limpia lo que ya está limpio. Perfeccionista." };
  if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) return { sign: "Libra ♎", trait: "Indeciso nivel experto. Encantador." };
  if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) return { sign: "Escorpio ♏", trait: "Intenso. Si te mira mal, corre." };
  if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) return { sign: "Sagitario ♐", trait: "Aventura y caos. Sin filtro." };
  return { sign: "", trait: "" };
};

export const shareBirthday = async (name: string, days: number) => {
  const text = days === 0 
    ? `¡HOY es el cumple de ${name}! 🎂 Se lía parda. 🎉`
    : `Oye, quedan solo ${days} días para el cumple de ${name}. 🎁 Ve preparando la cartera.`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Alerta Wishly',
        text: text,
      });
    } catch (err) {
      console.log('Error sharing', err);
    }
  } else {
    // Fallback simple alert or clipboard copy
    navigator.clipboard.writeText(text);
    alert('Texto copiado al portapapeles: ' + text);
  }
};

// --- NEW FEATURES UTILS ---

export const RANDOM_LOOT = [
  "Tarjeta Regalo de Amazon",
  "Calcetines con su cara",
  "Cena pagada (barata)",
  "Funko Pop aleatorio",
  "Planta (se le morirá)",
  "Libro de autoayuda",
  "Juego de mesa complejo",
  "Taza personalizada fea",
  "Curso de cocina online",
  "Suscripción a Netflix",
  "Nada (un abrazo)",
  "Una piedra pintada",
  "Botella de vino bueno",
  "Auriculares Bluetooth",
  "Camiseta friki"
];

export const getDominantZodiac = (birthdays: Birthday[]) => {
  if (birthdays.length === 0) return { sign: "N/A", count: 0 };
  
  const counts: Record<string, number> = {};
  birthdays.forEach(b => {
    const z = getZodiacData(b.day, b.month).sign;
    counts[z] = (counts[z] || 0) + 1;
  });

  let maxSign = "";
  let maxCount = 0;

  for (const sign in counts) {
    if (counts[sign] > maxCount) {
      maxCount = counts[sign];
      maxSign = sign;
    }
  }

  return { sign: maxSign, count: maxCount };
};

export const getAverageAge = (birthdays: Birthday[]) => {
  const withYear = birthdays.filter(b => b.year);
  if (withYear.length === 0) return 0;

  const currentYear = new Date().getFullYear();
  const totalAge = withYear.reduce((sum, b) => sum + (currentYear - (b.year || currentYear)), 0);
  return Math.round(totalAge / withYear.length);
};

// --- OPTIMIZATION LOGIC ---

// Minified interface for storage
interface MinifiedBirthday {
  i: string; // id
  n: string; // name
  d: number; // day
  m: number; // month
  y?: number; // year
  t?: string; // notes (text)
  g?: string; // giftIdea
}

export const compressBirthdays = (birthdays: Birthday[]): MinifiedBirthday[] => {
  return birthdays.map(b => ({
    i: b.id,
    n: b.name,
    d: b.day,
    m: b.month,
    ...(b.year && { y: b.year }),
    ...(b.notes && { t: b.notes }),
    ...(b.giftIdea && { g: b.giftIdea }),
  }));
};

export const decompressBirthdays = (minified: any[]): Birthday[] => {
  if (!Array.isArray(minified)) return [];
  // Basic check if it's legacy data (has 'id') or new data (has 'i')
  if (minified.length > 0 && 'name' in minified[0]) {
      return minified as Birthday[]; // Return as is if legacy
  }

  return minified.map(m => ({
    id: m.i,
    name: m.n,
    day: m.d,
    month: m.m,
    year: m.y,
    notes: m.t,
    giftIdea: m.g
  }));
};

// --- SECURITY UTILS ---
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'wishly-super-secret-key-v1';

export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (e) {
    return null;
  }
};