import React from 'react';
import { ShieldCheck, X, Lock, EyeOff, HardDrive } from 'lucide-react';
import { NeoButton } from './NeoComponents';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#111] border-4 border-black dark:border-white w-full max-w-sm shadow-[8px_8px_0px_0px_#6A4C93] overflow-hidden animate-pop">
        
        {/* Header */}
        <div className="bg-[#FF7A5A] p-4 border-b-4 border-black flex justify-between items-center">
          <h2 className="text-xl font-black text-black uppercase tracking-tighter italic flex items-center gap-2">
            <ShieldCheck size={24} /> PRIVACIDAD
          </h2>
          <button onClick={onClose} className="text-black hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-black dark:bg-white p-2 h-fit border-2 border-black">
                <HardDrive className="text-[#48CAE4] dark:text-black" size={20} />
              </div>
              <div>
                <p className="font-black text-xs uppercase dark:text-white">100% Local-First</p>
                <p className="text-[11px] opacity-70 dark:text-white leading-tight mt-1">
                  Tus datos nunca salen de este dispositivo. No hay servidores, no hay nubes, no hay fugas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-black dark:bg-white p-2 h-fit border-2 border-black">
                <Lock className="text-[#A3E635] dark:text-black" size={20} />
              </div>
              <div>
                <p className="font-black text-xs uppercase dark:text-white">Cifrado Militar</p>
                <p className="text-[11px] opacity-70 dark:text-white leading-tight mt-1">
                  Usamos AES-256 para proteger tus cumpleaños. Incluso si alguien roba tu móvil, tus datos están a salvo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-black dark:bg-white p-2 h-fit border-2 border-black">
                <EyeOff className="text-[#A3E635] dark:text-black" size={20} />
              </div>
              <div>
                <p className="font-black text-xs uppercase dark:text-white">Sin Rastreo</p>
                <p className="text-[11px] opacity-70 dark:text-white leading-tight mt-1">
                  No usamos Analytics ni cookies. Wishly es una herramienta, no un producto publicitario.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-100 dark:bg-gray-800 border-2 border-black text-[10px] font-bold dark:text-white italic">
            "Lo que pasa en Wishly, se queda en Wishly."
          </div>

          <NeoButton onClick={onClose} fullWidth variant="black" className="mt-2">
             CERRAR PROTOCOLO
          </NeoButton>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
