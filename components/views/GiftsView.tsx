import React, { useState } from 'react';
import { Gift, Plus, Trash2, ExternalLink, User, Tag, AlignLeft, X } from 'lucide-react';
import { GiftIdea } from '../../types';
import { NeoButton, NeoCard, NeoInput } from '../ui/NeoComponents';
import { generateId } from '../../utils';

interface GiftsViewProps {
  gifts: GiftIdea[];
  onAdd: (gift: GiftIdea) => void;
  onDelete: (id: string) => void;
}

const GiftsView: React.FC<GiftsViewProps> = ({ gifts, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [recipient, setRecipient] = useState('');
  const [category, setCategory] = useState('Amigos');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | string>('Todos');

  const CATEGORIES = ['Para mí', 'Familia', 'Amigos', 'Pareja', 'Otros'];
  const FILTER_CATEGORIES = ['Todos', ...CATEGORIES];

  const filteredGifts = gifts.filter(g => selectedCategory === 'Todos' || g.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !recipient) return;

    onAdd({
      id: generateId(),
      name,
      description,
      link,
      recipient,
      category
    });

    // Reset
    setName('');
    setDescription('');
    setLink('');
    setRecipient('');
    setCategory('Amigos');
    setShowAdd(false);
  };

  return (
    <div className="h-full flex flex-col relative bg-transparent overflow-y-auto no-scrollbar">
      <div className="p-5 pb-32">
        {/* Header */}
        <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-5xl font-black uppercase leading-[0.8] tracking-tighter text-black dark:text-white">
                    Gift<br/><span className="text-[#FF7A5A]">Lab</span>
                </h2>
                <button 
                    onClick={() => setShowAdd(!showAdd)}
                    className={`w-12 h-12 border-2 border-black dark:border-white flex items-center justify-center shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[2px] transition-all ${showAdd ? 'bg-red-500' : 'bg-[#48CAE4]'}`}
                >
                    {showAdd ? <X size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
                </button>
            </div>
            <div className="w-16 h-2 bg-black dark:bg-white mb-2"></div>
            <p className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest">Protocolo de deseos activado</p>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="mb-10 animate-fade-in-up">
            <div className="bg-white dark:bg-[#111] border-4 border-black dark:border-white p-5 shadow-[8px_8px_0px_0px_#FF7A5A] space-y-4">
               <h3 className="font-black text-xl uppercase italic dark:text-white">Nuevo Registro</h3>
               
               <NeoInput 
                 label="¿Qué es?"
                 placeholder="Ej: Teclado Mecánico..."
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="bg-gray-50 dark:bg-black"
               />

               <div className="grid grid-cols-2 gap-3">
                 <NeoInput 
                    label="¿Para quién?"
                    placeholder="Nombre o Yo"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-gray-50 dark:bg-black"
                 />
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest dark:text-gray-400">Tipo</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-[48px] bg-gray-50 dark:bg-black dark:text-white border-2 border-black dark:border-white px-2 font-bold text-sm outline-none appearance-none"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
               </div>

               <NeoInput 
                 label="Enlace (Opcional)"
                 placeholder="https://..."
                 value={link}
                 onChange={(e) => setLink(e.target.value)}
                 className="bg-gray-50 dark:bg-black"
               />

               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest dark:text-gray-400">Descripción</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-24 bg-gray-50 dark:bg-black dark:text-white border-2 border-black dark:border-white p-3 font-bold text-sm outline-none resize-none"
                    placeholder="Detalles del regalo..."
                  />
               </div>

               <NeoButton onClick={handleSubmit} fullWidth variant="primary" className="py-4 shadow-[4px_4px_0px_0px_#000]">
                  GUARDAR EN EL LABORATORIO
               </NeoButton>
            </div>
          </div>
        )}

        {/* Filters */}
        {!showAdd && gifts.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-6 -mt-2">
              {FILTER_CATEGORIES.map((cat) => (
                  <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                          flex-shrink-0 px-3 py-1 text-[9px] font-black uppercase border-2 border-black dark:border-white transition-all
                          ${selectedCategory === cat 
                              ? 'bg-[#FF7A5A] text-black translate-y-[2px] shadow-none' 
                              : 'bg-white dark:bg-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-y-[2px]'}
                      `}
                  >
                      {cat}
                  </button>
              ))}
          </div>
        )}

        {/* Gifts List */}
        <div className="space-y-4">
            {filteredGifts.length === 0 ? (
                <div className="text-center py-20 opacity-20 filter grayscale">
                    <Gift size={64} className="mx-auto mb-4" />
                    <p className="font-black text-xl uppercase tracking-widest">Sin Ideas de Regalos</p>
                </div>
            ) : (
                filteredGifts.map((gift) => (
                    <div key={gift.id} className="animate-pop">
                        <div className="bg-white dark:bg-[#111] border-2 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FF7A5A] group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="inline-block bg-[#6A4C93] text-white text-[8px] font-black px-2 py-0.5 uppercase mb-1">
                                        {gift.category}
                                    </div>
                                    <h4 className="text-2xl font-black uppercase leading-tight dark:text-white group-hover:text-[#6A4C93] transition-colors">
                                        {gift.name}
                                    </h4>
                                </div>
                                <button 
                                    onClick={() => onDelete(gift.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs mb-4">
                                <div className="flex items-center gap-1.5 font-bold dark:text-white">
                                    <User size={14} className="text-[#48CAE4]" />
                                    <span>{gift.recipient}</span>
                                </div>
                                {gift.link && (
                                    <a 
                                        href={gift.link} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 font-bold text-[#6A4C93] dark:text-[#48CAE4] hover:underline"
                                    >
                                        <ExternalLink size={14} />
                                        <span>Ver Tienda</span>
                                    </a>
                                )}
                            </div>

                            {gift.description && (
                                <div className="bg-gray-50 dark:bg-black p-3 border-l-4 border-[#48CAE4] italic text-sm font-medium dark:text-gray-300">
                                    {gift.description}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default GiftsView;
