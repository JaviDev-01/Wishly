import React, { useRef, useState, useEffect } from 'react';
import { NeoButton, NeoCard } from '../ui/NeoComponents';
import { LogOut, Trash, Database, Moon, Sun, BarChart2, Activity, Download, Upload, HardDrive, Calendar, ShieldCheck } from 'lucide-react';
import { Birthday } from '../../types';
import { getDominantZodiac, getAverageAge, compressBirthdays, decompressBirthdays } from '../../utils';

interface ProfileViewProps {
  userName: string;
  userDOB: string | null;
  count: number;
  onLogout: () => void;
  onClearData: () => void;
  toggleTheme: () => void;
  isDark: boolean;
  birthdays?: Birthday[]; 
}

const ProfileView: React.FC<ProfileViewProps> = ({ userName, userDOB, count, onLogout, onClearData, toggleTheme, isDark, birthdays = [] }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dominantZodiac = getDominantZodiac(birthdays);
  const averageAge = getAverageAge(birthdays);
  const [storageSize, setStorageSize] = useState<string>("0 B");
  const [storagePercent, setStoragePercent] = useState<number>(0);

  // Calculate storage usage
  useEffect(() => {
    // We simulate the compressed size
    const compressed = compressBirthdays(birthdays);
    const jsonString = JSON.stringify(compressed);
    const bytes = new Blob([jsonString]).size;
    
    // Convert to readable format
    if (bytes < 1024) setStorageSize(`${bytes} Bytes`);
    else setStorageSize(`${(bytes / 1024).toFixed(2)} KB`);

    const visualMax = 10000; 
    setStoragePercent(Math.min((bytes / visualMax) * 100, 100));

  }, [birthdays]);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("¿Seguro que quieres borrar TODOS los cumpleaños? Esto no se puede deshacer.")) {
      onClearData();
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("¿Quieres cambiar de usuario?")) {
        onLogout();
    }
  }

  // --- Backup Logic ---
  const handleExport = () => {
    const dataStr = JSON.stringify(birthdays, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wishly_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const raw = JSON.parse(event.target?.result as string);
            let importedData: Birthday[] = [];
            
            if (Array.isArray(raw)) {
                 if (raw.length > 0 && 'n' in raw[0]) {
                     importedData = decompressBirthdays(raw);
                 } else {
                     importedData = raw; 
                 }

                if(window.confirm(`Se han encontrado ${importedData.length} cumpleaños. ¿Reemplazar los actuales?`)) {
                    localStorage.setItem('cb_data', JSON.stringify(compressBirthdays(importedData)));
                    window.location.reload(); 
                }
            } else {
                alert("Formato de archivo inválido.");
            }
        } catch (err) {
            alert("Error al leer el archivo.");
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar relative flex flex-col">
      <div className="p-4 pb-32">
        <h2 className="text-4xl font-black uppercase mb-6 border-l-[10px] border-[#7C3AED] pl-4 leading-none dark:text-white">
            Centro de<br/>Mando
        </h2>

        {/* Identity Card - Changed to White Background for Black Text visibility */}
        <NeoCard className="mb-6 bg-white text-black dark:bg-white dark:text-black dark:border-white">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#7C3AED] mb-2 border-b border-black pb-1">Identidad Activa</h3>
            <p className="text-5xl font-black uppercase break-words text-black">{userName}</p>
            
            {userDOB && (
                <div className="flex items-center gap-2 mt-2 text-sm font-bold opacity-70">
                    <Calendar size={14} />
                    <span>Nacimiento: {userDOB}</span>
                </div>
            )}

            <div className="mt-6 flex items-center gap-2 bg-[#7C3AED] w-fit px-3 py-1 text-white border border-black shadow-[2px_2px_0px_0px_#000]">
            <Database size={16} />
            <span className="font-black uppercase text-sm">{count} Archivos</span>
            </div>
        </NeoCard>

        {/* Storage Optimization Viz */}
        <div className="mb-4 bg-white dark:bg-[#111] border-2 border-black dark:border-white p-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <HardDrive size={16} className="text-[#A3E635]" />
                    <span className="text-xs font-black uppercase dark:text-white">Uso de Memoria (Optimizado)</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#7C3AED]">{storageSize}</span>
            </div>
            {/* Progress Bar Container */}
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 border border-black dark:border-gray-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '4px 4px'}}></div>
                <div 
                    className="h-full bg-[#A3E635] transition-all duration-500" 
                    style={{ width: `${Math.max(storagePercent, 2)}%` }}
                ></div>
            </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="border-2 border-black dark:border-white p-3 bg-white dark:bg-[#111] shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#7C3AED]">
                <div className="flex items-center gap-1 mb-2">
                    <BarChart2 size={16} className="text-[#7C3AED]" />
                    <span className="text-[9px] font-black uppercase dark:text-white">Zodiaco Dominante</span>
                </div>
                <div className="text-2xl font-black uppercase leading-none dark:text-white truncate">
                    {dominantZodiac.count > 0 ? dominantZodiac.sign : "N/A"}
                </div>
                <div className="text-[10px] font-bold text-gray-500 mt-1">{dominantZodiac.count} Miembros</div>
            </div>

            <div className="border-2 border-black dark:border-white p-3 bg-white dark:bg-[#111] shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#7C3AED]">
                <div className="flex items-center gap-1 mb-2">
                    <Activity size={16} className="text-[#7C3AED]" />
                    <span className="text-[9px] font-black uppercase dark:text-white">Edad Media</span>
                </div>
                <div className="text-2xl font-black uppercase leading-none dark:text-white">
                    {averageAge > 0 ? averageAge : "--"}
                </div>
                <div className="text-[10px] font-bold text-gray-500 mt-1">Años</div>
            </div>
        </div>

        <div className="space-y-4">
            
            <NeoButton onClick={toggleTheme} fullWidth variant="secondary" className="flex items-center justify-between dark:bg-black dark:text-white dark:border-white">
                <span>{isDark ? 'MODO LUZ' : 'MODO NOCHE'}</span>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </NeoButton>

            {/* Data Management */}
            <div className="grid grid-cols-2 gap-4">
                <NeoButton onClick={handleExport} variant="ghost" className="flex flex-col items-center gap-1 py-2 text-xs">
                    <Download size={20} /> EXPORTAR JSON
                </NeoButton>
                <NeoButton onClick={handleImportClick} variant="ghost" className="flex flex-col items-center gap-1 py-2 text-xs">
                    <Upload size={20} /> IMPORTAR JSON
                </NeoButton>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            </div>

            <NeoButton type="button" onClick={handleLogout} fullWidth variant="primary" className="flex items-center justify-between">
            <span>CERRAR SESIÓN</span>
            <LogOut size={20} />
            </NeoButton>

            <NeoButton type="button" onClick={handleClear} fullWidth variant="black" className="flex items-center justify-between text-red-500 border-red-500 dark:border-red-500 hover:bg-red-900/20">
            <span>RESETEAR SISTEMA</span>
            <Trash size={20} />
            </NeoButton>
        </div>

        {/* PRIVACY SECTION - NEW */}
        <div className="mt-8 mb-4 border-2 border-black dark:border-white p-4 bg-gray-100 dark:bg-gray-900 relative">
            <div className="absolute -top-3 left-3 bg-[#7C3AED] text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border border-black transform -rotate-1 shadow-[2px_2px_0px_0px_#000000]">
                Privacidad & Seguridad
            </div>
            <div className="flex gap-4 pt-2">
                 <div className="bg-black dark:bg-white p-2 h-fit border border-black dark:border-white shadow-[3px_3px_0px_0px_#A3E635]">
                    <ShieldCheck size={24} className="text-[#A3E635] dark:text-black flex-shrink-0" />
                 </div>
                 <div className="text-xs dark:text-white">
                    <p className="font-bold uppercase mb-2 text-[#7C3AED] dark:text-[#A3E635]">Tus datos son tuyos.</p>
                    <p className="opacity-80 leading-relaxed font-medium mb-2">
                        Esta aplicación funciona <strong>100% Offline</strong> (Local-First). La información de los cumpleaños se guarda exclusivamente en el almacenamiento local de tu dispositivo (LocalStorage).
                    </p>
                    <p className="opacity-70 leading-relaxed font-medium">
                        Nosotros no tenemos servidores, no rastreamos tu actividad y no podemos ver a quién felicitas. Lo que pasa en tu móvil, se queda en tu móvil.
                    </p>
                 </div>
            </div>
        </div>

        <div className="mt-auto text-center opacity-30 text-xs font-black uppercase tracking-widest dark:text-white pt-2">
            <p>Wishly System v4.1</p>
            <p>Secure Local Core</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;