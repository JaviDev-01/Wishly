import React, { useState, useEffect } from 'react';
import { Birthday, MONTHS, Category } from '../../types';
import { Search, Trash2, ChevronDown, ChevronUp, Star, Gift, Timer, Zap, ExternalLink, Award } from 'lucide-react';
import { getZodiacData, calculateAgeDetails, RANDOM_LOOT } from '../../utils';

interface ListViewProps {
  birthdays: Birthday[];
  onDelete: (id: string) => void;
}

// Check if gift string is a URL
const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

// Check for Milestones (18, 21, 30, 40, etc.)
const getMilestone = (year?: number) => {
    if(!year) return null;
    const age = new Date().getFullYear() - year;
    const nextAge = age + 1;
    if([18, 21, 30, 40, 50, 60, 70, 80, 90, 100].includes(nextAge)) {
        return nextAge;
    }
    return null;
};

// Subcomponent for the Live Age Timer
const LiveAge: React.FC<{ day: number, month: number, year?: number }> = ({ day, month, year }) => {
    const [age, setAge] = useState<{years: number, months: number, days: number, hours: number, minutes: number, seconds: number} | null>(null);

    useEffect(() => {
        if (!year) return;
        
        const update = () => {
            setAge(calculateAgeDetails(day, month, year));
        };
        
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [day, month, year]);

    if (!year) return <div className="text-xs font-bold text-gray-400">Año desconocido - Cronómetro desactivado</div>;
    if (!age) return null;

    return (
        <div className="bg-black dark:bg-white dark:text-black text-[#6A4C93] font-mono p-3 border-2 border-transparent dark:border-black rounded-sm text-center shadow-inner">
            <div className="text-[10px] text-white dark:text-black uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                <Timer size={12} /> Tiempo jugado
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="flex flex-col">
                    <span className="text-2xl font-black leading-none">{age.years}</span>
                    <span className="text-[8px] uppercase opacity-60">Años</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black leading-none">{age.months}</span>
                    <span className="text-[8px] uppercase opacity-60">Meses</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black leading-none">{age.days}</span>
                    <span className="text-[8px] uppercase opacity-60">Días</span>
                </div>
            </div>
            
            <div className="h-[1px] bg-[#A3E635] dark:bg-black opacity-30 mb-2"></div>
            
            <div className="flex justify-center gap-1 text-xs font-bold opacity-80">
                <span>{String(age.hours).padStart(2, '0')}h</span> :
                <span>{String(age.minutes).padStart(2, '0')}m</span> :
                <span>{String(age.seconds).padStart(2, '0')}s</span>
            </div>
        </div>
    );
};

// Subcomponent for Loot Roulette
const LootRoulette: React.FC = () => {
  const [loot, setLoot] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    let counter = 0;
    const maxSpins = 15;
    
    const interval = setInterval(() => {
      setLoot(RANDOM_LOOT[Math.floor(Math.random() * RANDOM_LOOT.length)]);
      counter++;
      if (counter > maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="border-2 border-dashed border-black dark:border-white p-3 mt-2 text-center">
      <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center justify-center gap-2 dark:text-white">
        <Zap size={12} className="text-[#7C3AED]" fill="#7C3AED" /> Generador de Loot
      </div>
      
      {loot ? (
         <div className={`text-xl font-black uppercase mb-3 text-[#6A4C93] dark:text-[#48CAE4] ${isSpinning ? 'blur-sm scale-90' : 'scale-100'}`}>
            {loot}
         </div>
      ) : (
         <div className="text-sm font-bold text-gray-400 mb-3">¿Sin ideas? Hackea el sistema</div>
      )}

      <button 
        onClick={handleSpin}
        disabled={isSpinning}
        type="button"
        className={`bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase py-2 px-4 w-full hover:bg-[#6A4C93] dark:hover:bg-[#48CAE4] transition-colors ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSpinning ? 'CALCULANDO...' : 'HACKEAR REGALO'}
      </button>
    </div>
  );
};

const ListView: React.FC<ListViewProps> = ({ birthdays, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');

  const CATEGORIES: (Category | 'Todos')[] = ['Todos', 'Familia', 'Amigos', 'Trabajo', 'Pareja', 'Otros'];

  const filtered = birthdays.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const groupedBirthdays = Array.from({ length: 12 }, (_, i) => {
    return {
      monthName: MONTHS[i],
      items: filtered.filter(b => b.month === i + 1).sort((a, b) => a.day - b.day)
    };
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    // Critical: Stop propagation to prevent card collapse/expand
    e.preventDefault();
    e.stopPropagation(); 
    
    if (window.confirm("¿CONFIRMAS LA ELIMINACIÓN DE ESTE OBJETIVO?")) {
      setDeletingIds(prev => [...prev, id]);
      
      // Wait for animation
      setTimeout(() => {
        onDelete(id);
        // Clean up internal state (though component likely unmounts the item)
        setDeletingIds(prev => prev.filter(did => did !== id));
      }, 400);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    // Added h-full and overflow-y-auto HERE to handle scrolling within the view
    <div className="h-full overflow-y-auto no-scrollbar relative flex flex-col">
      <div className="p-4 pb-32">
        <div className="sticky top-0 bg-[#f4f4f5]/90 dark:bg-[#09090b]/90 backdrop-blur-md z-30 pb-4 pt-2 transition-colors duration-300">
          <h2 className="text-5xl md:text-6xl font-black uppercase mb-4 leading-[0.85] tracking-tighter text-black dark:text-white">
            Lista de<br/><span className="text-[#7C3AED] text-stroke-black">Cumpleaños</span>
          </h2>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="BUSCAR..." 
              className="w-full border-2 border-black dark:border-white p-4 pl-4 font-black outline-none shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#7C3AED] focus:shadow-[2px_2px_0px_0px_#7C3AED] focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white dark:bg-black text-black dark:text-white uppercase placeholder:text-gray-300 dark:placeholder:text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category Filter Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 mt-2">
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
        </div>

        <div className="space-y-6 mt-6">
          {groupedBirthdays.map((group, index) => {
            if (group.items.length === 0) return null;
            
            return (
              <div key={index} className="relative animate-pop" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center gap-4 mb-3 sticky top-[140px] z-10 pointer-events-none">
                  <span className="bg-black dark:bg-white text-white dark:text-black font-black px-3 py-1 text-sm uppercase transform -rotate-1 shadow-[3px_3px_0px_0px_#6A4C93]">
                    {group.monthName}
                  </span>
                  <div className="h-[2px] bg-black dark:bg-white flex-1 opacity-20"></div>
                </div>
                
                <div className="grid gap-4">
                  {group.items.map(bday => {
                    const isDeleting = deletingIds.includes(bday.id);
                    const isExpanded = expandedId === bday.id;
                    const zodiac = getZodiacData(bday.day, bday.month);
                    const milestone = getMilestone(bday.year);
                    
                    return (
                      <div key={bday.id} className={isDeleting ? 'animate-yeet' : ''}>
                        <div 
                          onClick={() => toggleExpand(bday.id)}
                          className={`
                              border-2 border-black dark:border-white bg-white dark:bg-[#111] transition-all cursor-pointer relative
                              ${isExpanded ? 'shadow-[6px_6px_0px_0px_#6A4C93] -translate-y-1' : 'shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#333] hover:bg-gray-50 dark:hover:bg-gray-900'}
                          `}
                        >
                          {/* Status bar */}
                          {isExpanded && <div className="absolute top-0 left-0 w-full h-1 bg-[#6A4C93]"></div>}

                          {/* Summary Line */}
                          <div className="flex justify-between items-center p-4">
                              <div className="flex items-center gap-4">
                                  <div className="font-black text-3xl w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white bg-[#6A4C93] text-white rounded-full">
                                      {bday.day}
                                  </div>
                                  <div>
                                      <h4 className="font-black text-xl uppercase leading-none dark:text-white flex items-center gap-2">
                                          {bday.name}
                                          <span className="bg-black dark:bg-white text-white dark:text-black text-[8px] px-1.5 py-0.5 border border-black transform rotate-1">
                                            {bday.category || 'Amigos'}
                                          </span>
                                          {milestone && (
                                              <span className="bg-[#A3E635] text-black text-[9px] px-1 py-0.5 rounded-sm flex items-center gap-1 border border-black">
                                                  <Award size={8} /> {milestone}
                                              </span>
                                          )}
                                      </h4>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3 dark:text-white">
                                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                              </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                              <div className="p-4 bg-gray-50 dark:bg-[#111] border-t-2 border-black dark:border-white space-y-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-2">
                                          <div className="flex items-center gap-1 mb-1 dark:text-white">
                                              <Star size={14} className="fill-black dark:fill-white" />
                                              <span className="text-[10px] uppercase font-bold">Signo</span>
                                          </div>
                                          <p className="font-black text-sm uppercase dark:text-white">{zodiac.sign}</p>
                                      </div>
                                      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-2 relative overflow-hidden">
                                          <div className="flex items-center gap-1 mb-1 dark:text-white">
                                              <Gift size={14} />
                                              <span className="text-[10px] uppercase font-bold">Regalo</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                              <p className="font-bold text-sm truncate dark:text-gray-300 max-w-[80%]">{bday.giftIdea || "Sin asignar"}</p>
                                              {bday.giftIdea && isUrl(bday.giftIdea) && (
                                                  <a href={bday.giftIdea} target="_blank" rel="noreferrer" className="text-[#6A4C93] dark:text-[#48CAE4] hover:scale-125 transition-transform">
                                                      <ExternalLink size={16} />
                                                  </a>
                                              )}
                                          </div>
                                      </div>
                                  </div>

                                  <LiveAge day={bday.day} month={bday.month} year={bday.year} />
                                  
                                  <LootRoulette />

                                  {bday.notes && (
                                      <div className="bg-white dark:bg-black border-2 border-dashed border-gray-400 p-3 text-sm font-bold italic dark:text-gray-300">
                                          "{bday.notes}"
                                      </div>
                                  )}
                                  
                                  <button 
                                      type="button"
                                      onClick={(e) => handleDeleteClick(e, bday.id)}
                                      className="w-full bg-black dark:bg-[#6A4C93] text-white py-3 font-black uppercase hover:bg-red-600 dark:hover:bg-red-600 transition-colors flex items-center justify-center gap-2 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#6A4C93] dark:shadow-[2px_2px_0px_0px_#ffffff]"
                                  >
                                      <Trash2 size={18} /> ELIMINAR OBJETIVO
                                  </button>
                              </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center opacity-30">
              <div className="text-6xl mb-4 grayscale dark:invert">💀</div>
              <p className="font-black text-2xl uppercase dark:text-white">Sin Datos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListView;