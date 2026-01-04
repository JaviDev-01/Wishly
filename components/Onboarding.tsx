import React, { useState } from 'react';
import { NeoButton, NeoInput } from './ui/NeoComponents';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (name: string, dob: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('NOMBRE REQUERIDO');
      return;
    }
    
    // Validate DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(dob)) {
      setError('FORMATO INVÁLIDO (DD/MM/YYYY)');
      return;
    }
    
    const [_, day, month, year] = dob.match(dateRegex) as RegExpMatchArray;
    const isValidDate = !isNaN(new Date(`${year}-${month}-${day}`).getTime());
    
    if (!isValidDate) {
        setError('FECHA INVÁLIDA');
        return;
    }

    // Convert to YYYY-MM-DD for consistency
    onComplete(name, `${year}-${month}-${day}`);
  };

  const handleDateChange = (val: string) => {
    // Auto-format DD/MM/YYYY
    let v = val.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 4) {
        v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length > 2) {
        v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    setDob(v);
    setError('');
  };

  return (
    // Container: Full screen white on mobile, gray patterned on desktop
    <div className="h-[100dvh] w-full bg-white md:bg-transparent flex flex-col items-center justify-center md:p-6 relative overflow-hidden">
      
      {/* Background Decor - Fixed positioning for immersion */}
      <div className="absolute top-[-20px] right-[-20px] w-40 h-40 md:w-64 md:h-64 border-4 border-black rounded-full opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 md:w-64 md:h-64 bg-[#7C3AED] rounded-full opacity-10 pointer-events-none"></div>

      {/* Main Content Wrapper: Full size on mobile, Card on desktop */}
      <div className="w-full h-full md:h-auto md:max-w-md animate-pop relative z-10">
        <div className="h-full md:h-auto flex flex-col justify-center border-0 md:border-[3px] border-black p-6 md:p-8 bg-white md:shadow-[12px_12px_0px_0px_#7C3AED]">
            
            {/* Inner Content - Centered */}
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                
                <div className="flex justify-center mb-8">
                    <div className="bg-black text-white px-3 py-1 text-xs font-black uppercase transform -rotate-2 border border-transparent shadow-[4px_4px_0px_0px_#A3E635]">
                        System Boot v3.0
                    </div>
                </div>
                
                <h1 className="text-7xl font-black text-center mb-2 uppercase leading-[0.8] tracking-tighter">
                Wishly
                </h1>
                <p className="text-center font-bold mb-12 uppercase text-sm tracking-[0.4em] text-[#7C3AED]">
                Electric Edition
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <NeoInput 
                        label="Identificación" 
                        placeholder="TU ALIAS..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                        }}
                        autoFocus
                        className="text-center bg-gray-50 mb-0 py-5 text-2xl"
                        />
                    </div>
                    
                    <div className="relative">
                        <NeoInput 
                            label="Fecha de Nacimiento" 
                            type="text"
                            placeholder="DD/MM/YYYY"
                            maxLength={10}
                            value={dob}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="text-center bg-gray-50 mb-0 py-5 text-xl"
                        />
                    </div>

                    {error && (
                        <div className="w-full text-center py-2 animate-bounce">
                            <span className="bg-[#7C3AED] text-white text-xs font-black px-3 py-1 uppercase transform rotate-1 inline-block shadow-[2px_2px_0px_0px_#000] border border-black">{error}</span>
                        </div>
                    )}

                    <div className="pt-6">
                        <NeoButton type="submit" variant="black" fullWidth className="py-5 text-xl flex items-center justify-center gap-3 group hover:bg-[#7C3AED] hover:border-[#7C3AED] transition-all">
                        INICIAR SISTEMA <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </NeoButton>
                    </div>
                </form>
            </div>

            {/* Mobile Footer */}
            <div className="md:hidden text-center mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Secure Local Environment</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;