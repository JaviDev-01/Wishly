import React from 'react';
import { ShieldCheck, Zap, Sparkles, Rocket, X } from 'lucide-react';
import { NeoButton } from './NeoComponents';

interface WhatIsNewModalProps {
  version: string;
  onClose: () => void;
}

const WhatIsNewModal: React.FC<WhatIsNewModalProps> = ({ version, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#111] border-4 border-black dark:border-white w-full max-w-sm shadow-[8px_8px_0px_0px_#A3E635] overflow-hidden animate-pop">
        
        {/* Header */}
        <div className="bg-[#7C3AED] p-4 border-b-4 border-black flex justify-between items-center">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">¡APP ACTUALIZADA!</h2>
          <button onClick={onClose} className="text-white hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 border-2 border-black">
             <Rocket className="text-[#7C3AED]" size={28} />
             <div>
                <p className="text-[10px] font-black uppercase opacity-50 dark:text-white">Nueva Versión</p>
                <p className="text-lg font-black dark:text-white">Build {version}</p>
             </div>
          </div>

          <div className="space-y-3">
             <div className="flex gap-3">
                <div className="bg-[#A3E635] p-1 h-fit border border-black shadow-[2px_2px_0px_0px_#000]">
                    <ShieldCheck size={18} />
                </div>
                <p className="text-xs font-bold dark:text-white leading-tight">
                   <span className="text-[#7C3AED]">FIX:</span> Sistema de rollback desactivado. Las actualizaciones ahora son persistentes.
                </p>
             </div>

             <div className="flex gap-3">
                <div className="bg-white p-1 h-fit border border-black shadow-[2px_2px_0px_0px_#000]">
                    <Sparkles size={18} />
                </div>
                <p className="text-xs font-bold dark:text-white leading-tight">
                   <span className="text-[#7C3AED]">NEW:</span> Soporte para Safe Areas. El diseño ya no choca con las notificaciones.
                </p>
             </div>

             <div className="flex gap-3">
                <div className="bg-[#A3E635] p-1 h-fit border border-black shadow-[2px_2px_0px_0px_#000]">
                    <Zap size={18} />
                </div>
                <p className="text-xs font-bold dark:text-white leading-tight">
                   <span className="text-[#7C3AED]">UI:</span> Aviso visual de actualización y novedades del sistema.
                </p>
             </div>
          </div>

          <NeoButton onClick={onClose} fullWidth variant="primary" className="mt-4">
             ¡ENTENDIDO!
          </NeoButton>
        </div>
      </div>
    </div>
  );
};

export default WhatIsNewModal;
