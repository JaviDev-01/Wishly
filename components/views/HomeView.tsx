import React, { useEffect } from 'react';
import { Birthday, Category } from '../../types';
import { NeoCard, NeoButton } from '../ui/NeoComponents';
import { getDaysUntilBirthday, sortBirthdays, getZodiacData, shareBirthday } from '../../utils';
import { Cake, Calendar, Frown, Megaphone, PartyPopper, Clock, Crown } from 'lucide-react';

// Declare canvas-confetti globally since we loaded it via CDN
declare global {
  interface Window {
    confetti: any;
  }
}

interface HomeViewProps {
  userName: string;
  userDOB: string | null;
  birthdays: Birthday[];
  onAddClick: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ userName, userDOB, birthdays, onAddClick }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<Category | 'Todos'>('Todos');
  const CATEGORIES: (Category | 'Todos')[] = ['Todos', 'Familia', 'Amigos', 'Trabajo', 'Pareja', 'Otros'];

  const filteredBirthdays = birthdays.filter(b => selectedCategory === 'Todos' || b.category === selectedCategory);
  const sorted = sortBirthdays(filteredBirthdays);
  const nextBirthday = sorted[0];
  const daysUntilNext = nextBirthday ? getDaysUntilBirthday(nextBirthday.day, nextBirthday.month).days : -1;
  const isToday = daysUntilNext === 0;

  // Check if it's user's birthday
  const checkUserBirthday = () => {
      if(!userDOB) return false;
      const today = new Date();
      const birth = new Date(userDOB);
      return today.getDate() === birth.getDate() && today.getMonth() === birth.getMonth();
  };

  const isUserBirthdayToday = checkUserBirthday();

  useEffect(() => {
    if ((isToday || isUserBirthdayToday) && window.confetti) {
      const duration = 2500;
      const end = Date.now() + duration;

      const frame = () => {
        window.confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#7C3AED', '#A3E635', '#FFFFFF']
        });
        window.confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#e70a49ff', '#A3E635', '#FFFFFF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isToday, isUserBirthdayToday]);

  return (
    <div className="flex flex-col h-full bg-transparent transition-colors duration-300 overflow-y-auto no-scrollbar">
      {/* Marquee Banner */}
      {(nextBirthday || isUserBirthdayToday) && (
        <div className="bg-[#7C3AED] text-white overflow-hidden py-2 border-b-2 border-black dark:border-white shadow-sm z-10">
          <div className="animate-marquee font-black uppercase text-sm tracking-[0.2em] flex items-center gap-8">
            {isUserBirthdayToday ? (
                 <>
                 <span>🎂 FELICIDADES OPERADOR {userName}</span>
                 <span>🎂 ERES EL MVP HOY</span>
                 <span>🎂 PIDE UN DESEO</span>
                 <span>🎂 SYSTEM CELEBRATION MODE</span>
               </>
            ) : isToday ? (
                <>
                  <span>✨ HOY ES EL DÍA</span>
                  <span>✨ MODO FIESTA ACTIVADO</span>
                  <span>✨ REGALOS O BAN</span>
                  <span>✨ FELICIDADES {nextBirthday.name}</span>
                </>
              ) : (
                <>
                  <span>🚀 PRÓXIMA MISIÓN: {nextBirthday.name}</span>
                  <span>🚀 T-MINUS: {daysUntilNext} DÍAS</span>
                  <span>🚀 PREPARA EL HYPE</span>
                </>
              )
            }
          </div>
        </div>
      )}

      <div className="p-5 pb-24 space-y-8 flex-1 relative">
        {/* Header */}
        <div className="relative pt-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xs font-black text-[#A3E635] dark:text-black uppercase tracking-widest bg-black dark:bg-[#A3E635] text-white w-fit px-2 py-1 transform rotate-1 border border-white dark:border-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                Operador_001
              </h2>
              <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white leading-[0.85] uppercase tracking-tighter mt-3 break-words">
                {isUserBirthdayToday ? "¡TU DÍA!" : userName}
              </h1>
            </div>
            {(isToday || isUserBirthdayToday) && (
              <div className="animate-bounce">
                <PartyPopper size={40} className="text-[#7C3AED]" />
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mt-4">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                        flex-shrink-0 px-3 py-1 text-[9px] font-black uppercase border-2 border-black dark:border-white transition-all
                        ${selectedCategory === cat 
                            ? 'bg-[#A3E635] text-black translate-y-[2px] shadow-none' 
                            : 'bg-white dark:bg-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-y-[2px]'}
                    `}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* User Birthday Special Card */}
        {isUserBirthdayToday && (
            <section className="animate-pop">
                 <div className="flex justify-between items-center mb-4 border-b-2 border-black dark:border-white pb-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Crown size={20} className="text-[#7C3AED]" strokeWidth={2.5} />
                        <h3 className="font-black text-xl uppercase tracking-wider text-black dark:text-white">Evento Especial</h3>
                    </div>
                </div>
                <NeoCard color="bg-[#A3E635]" className="animate-party border-black text-black">
                    <h2 className="text-4xl font-black uppercase mb-2">¡Feliz Cumpleaños!</h2>
                    <p className="font-bold text-lg mb-4">El sistema ha detectado que hoy subes de nivel. Disfruta tu día.</p>
                    <div className="flex gap-2">
                        <span className="bg-black text-white px-3 py-1 font-black uppercase text-xs">Level Up</span>
                        <span className="bg-white text-black px-3 py-1 font-black uppercase text-xs border border-black">+1000 XP</span>
                    </div>
                </NeoCard>
            </section>
        )}

        {/* Main Spotlight (Only show if it's NOT user birthday, or if user birthday allows space) */}
        {!isUserBirthdayToday && (
            <section className="animate-pop stagger-1">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black dark:border-white pb-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <Cake size={20} className="text-[#7C3AED]" strokeWidth={2.5} />
                    <h3 className="font-black text-xl uppercase tracking-wider text-black dark:text-white">Próximo Objetivo</h3>
                </div>
                {isToday && <span className="bg-[#A3E635] text-black text-[10px] font-black px-2 py-1 uppercase animate-pulse">Celebrando</span>}
            </div>
            
            {nextBirthday ? (
                <NeoCard 
                color={isToday ? "bg-[#7C3AED]" : "bg-white"} 
                className={`relative overflow-visible group transition-all duration-300 ${isToday ? 'animate-party border-[#7C3AED] dark:border-white' : ''}`}
                >
                {/* Badge */}
                <div className="absolute -top-5 -right-3 z-20">
                    <div className="bg-white dark:bg-black text-black dark:text-white font-black text-center px-4 py-2 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#A3E635] transform rotate-3 transition-colors duration-300">
                        <span className="block text-3xl leading-none">{daysUntilNext}</span>
                        <span className="block text-[10px] uppercase tracking-widest">Días</span>
                    </div>
                </div>

                <div className="pt-2">
                    <h2 className={`text-4xl font-black uppercase mb-3 break-words leading-none ${isToday ? 'text-white drop-shadow-md' : 'text-black dark:text-white'}`}>
                        {nextBirthday.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className={`border-2 border-black px-2 py-1 text-xs font-bold uppercase ${isToday ? 'bg-black text-white' : 'bg-[#7C3AED] text-white'}`}>
                            {nextBirthday.day} / {nextBirthday.month}
                        </span>
                        <span className={`border-2 border-black px-2 py-1 text-xs font-bold uppercase ${isToday ? 'bg-white text-black' : 'bg-white text-black'}`}>
                            {getZodiacData(nextBirthday.day, nextBirthday.month).sign}
                        </span>
                    </div>

                    <NeoButton 
                        onClick={() => shareBirthday(nextBirthday.name, daysUntilNext)}
                        variant={isToday ? "black" : "violet"}
                        fullWidth 
                        className="flex items-center justify-center gap-2 text-sm shadow-none"
                    >
                    <Megaphone size={18} /> {isToday ? "ANUNCIAR A TODOS" : "GENERAR HYPE"}
                    </NeoButton>
                </div>
                </NeoCard>
            ) : (
                <NeoCard color="bg-white" className="flex flex-col items-center justify-center py-10 text-center border-dashed dark:bg-[#111] dark:border-gray-700">
                <Frown size={48} className="mb-4 text-black dark:text-gray-500" />
                <p className="font-black text-xl text-gray-400 dark:text-gray-500 uppercase mb-4">No hay datos</p>
                <NeoButton onClick={onAddClick} variant="black">
                    + AGREGAR
                </NeoButton>
                </NeoCard>
            )}
            </section>
        )}

        {/* Quick List */}
        {sorted.length > 1 && (
          <section className="animate-pop stagger-2">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-black dark:border-white pb-1 w-fit bg-white/50 dark:bg-black/50 backdrop-blur-sm p-1 px-2 rounded-sm">
              <Calendar size={20} className="text-black dark:text-white"/>
              <h3 className="font-black text-lg uppercase tracking-wider text-black dark:text-white">En Cola</h3>
            </div>
            <div className="space-y-3">
              {sorted.slice(1, 4).map((bday, i) => {
                const days = getDaysUntilBirthday(bday.day, bday.month).days;
                return (
                  <div key={bday.id} className="group cursor-default">
                    <div className="flex items-center justify-between border-2 border-black dark:border-white bg-white dark:bg-[#111] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#7C3AED] hover:translate-x-1 transition-transform">
                        {/* Left: Date */}
                        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-black border border-black dark:border-gray-700 px-3 py-1 mr-3 min-w-[3.5rem]">
                            <span className="text-xl font-black leading-none text-black dark:text-white">{bday.day}</span>
                            <span className="text-[10px] font-bold uppercase text-gray-500">{bday.month}</span>
                        </div>
                        
                        {/* Middle: Name */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-lg uppercase truncate text-black dark:text-white">{bday.name}</h4>
                        </div>

                        {/* Right: Days left pill */}
                        <div className="ml-3 flex items-center gap-1 bg-black dark:bg-[#A3E635] text-white dark:text-black px-2 py-1 rounded-sm border border-black dark:border-white">
                            <Clock size={12} className="animate-pulse" />
                            <span className="text-xs font-bold uppercase whitespace-nowrap">{days} Días</span>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomeView;