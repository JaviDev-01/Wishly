import React, { useState } from 'react';
import { Birthday } from '../../types';
import { NeoButton, NeoInput } from '../ui/NeoComponents';
import { Save, X, AlignLeft } from 'lucide-react';
import { generateId } from '../../utils';

interface AddViewProps {
  onAdd: (birthday: Birthday) => void;
  onCancel: () => void;
}

const AddView: React.FC<AddViewProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [giftIdea, setGiftIdea] = useState('');

  const handleDateChange = (val: string) => {
    let v = val.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 4) {
        v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length > 2) {
        v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    setDate(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) {
        alert("Formato de fecha inválido (DD/MM/YYYY)");
        return;
    }
    const [_, day, month, year] = date.match(dateRegex) as RegExpMatchArray;

    const newBirthday: Birthday = {
      id: generateId(),
      name,
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      notes,
      giftIdea
    };

    onAdd(newBirthday);
  };

  return (
    <div className="h-full flex flex-col relative bg-[#f4f4f5] dark:bg-[#09090b] animate-fade-in-up">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center p-5 pt-6">
            <button 
                onClick={onCancel} 
                className="group flex items-center justify-center w-10 h-10 border-2 border-black dark:border-white bg-white dark:bg-black shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-y-[2px] transition-all"
            >
                <X size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform dark:text-white" />
            </button>
            <div className="text-[10px] font-black uppercase tracking-widest bg-[#A3E635] px-3 py-1 border border-black shadow-[2px_2px_0px_0px_#000]">
                Write Mode
            </div>
        </div>

        {/* Big Header */}
        <div className="px-6 mb-2">
            <h1 className="text-5xl font-black uppercase leading-[0.8] tracking-tighter text-black dark:text-white mb-3">
                Nuevo<br/><span className="text-[#7C3AED]">Objetivo</span>
            </h1>
            <div className="w-16 h-2 bg-black dark:bg-white mb-6"></div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-2">
                
                <NeoInput 
                    label="Identificación (Nombre)"
                    placeholder="ALIAS..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    className="bg-white dark:bg-[#111]"
                />

                <NeoInput 
                    label="Fecha de Aparición"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    required
                    className="bg-white dark:bg-[#111]"
                />

                <NeoInput 
                    label="Intel de Regalo (Opcional)"
                    placeholder="URL o Idea..."
                    value={giftIdea}
                    onChange={(e) => setGiftIdea(e.target.value)}
                    className="bg-white dark:bg-[#111]"
                />

                {/* Custom Text Area */}
                <div className="w-full mb-8">
                    <label className="block font-black mb-1 text-white text-xs uppercase tracking-widest bg-black dark:bg-[#7C3AED] dark:text-white border-2 border-black dark:border-white w-fit px-3 py-1 transform -rotate-1 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">
                        Notas de Archivo
                    </label>
                    <div className="relative">
                        <textarea 
                            className="w-full bg-white dark:bg-[#111] dark:text-white border-2 border-black dark:border-white p-4 text-lg font-bold outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] focus:shadow-[4px_4px_0px_0px_#7C3AED] transition-all resize-none h-32 placeholder:text-gray-300 dark:placeholder:text-gray-700"
                            placeholder="Datos adicionales..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <AlignLeft className="absolute bottom-3 right-3 opacity-20 pointer-events-none" size={24} />
                    </div>
                </div>

                <div className="pt-2 pb-10">
                    <NeoButton type="submit" variant="violet" fullWidth className="py-5 text-xl flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
                        <Save size={24} strokeWidth={2.5} /> CONFIRMAR DATOS
                    </NeoButton>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddView;