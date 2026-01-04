import React from 'react';

// --- Neo Button ---
interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'black' | 'ghost' | 'violet' | 'lime';
  fullWidth?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "font-black border-2 border-black py-4 px-6 text-lg uppercase tracking-wider transition-all active:translate-y-1 active:shadow-none relative overflow-hidden dark:border-white";
  
  const variants = {
    // White button, black text, violet shadow
    primary: "bg-white text-black shadow-[4px_4px_0px_0px_#7C3AED] hover:bg-gray-50 hover-glitch", 
    // Black button, white text, violet shadow
    black: "bg-black text-white shadow-[4px_4px_0px_0px_#7C3AED] hover:bg-gray-900 border-white hover-glitch",
    // Violet button, white text, black shadow
    violet: "bg-[#7C3AED] text-white shadow-[4px_4px_0px_0px_#000000] hover:bg-violet-600 dark:shadow-[4px_4px_0px_0px_#ffffff] hover-glitch-lime",
    // Lime button, black text, black shadow
    lime: "bg-[#A3E635] text-black shadow-[4px_4px_0px_0px_#000000] hover:bg-lime-400 dark:shadow-[4px_4px_0px_0px_#ffffff] hover-glitch",
    // Secondary (White/Black only)
    secondary: "bg-white text-black shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#A3E635] hover-glitch",
    // Ghost
    ghost: "bg-transparent border-2 border-dashed border-gray-300 text-gray-400 hover:border-black hover:text-black shadow-none dark:hover:border-white dark:hover:text-white",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- Neo Card ---
interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  onClick?: () => void;
}

export const NeoCard: React.FC<NeoCardProps> = ({ 
  children, 
  className = '', 
  color = 'bg-white',
  onClick
}) => {
  // If user passed a specific color, use it. Otherwise, default adapts to dark mode.
  const isDefaultColor = color === 'bg-white';
  const colorClass = isDefaultColor ? 'bg-white dark:bg-black dark:text-white' : color;
  const borderColor = isDefaultColor ? 'border-black dark:border-white' : 'border-black';

  return (
    <div 
      onClick={onClick}
      className={`${colorClass} border-2 ${borderColor} p-5 shadow-[5px_5px_0px_0px_#000000] dark:shadow-[5px_5px_0px_0px_#7C3AED] transition-all hover:shadow-[8px_8px_0px_0px_#7C3AED] dark:hover:shadow-[8px_8px_0px_0px_#A3E635] hover:-translate-y-[2px] ${className}`}
    >
      {children}
    </div>
  );
};

// --- Neo Input ---
interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full mb-6">
      {label && <label className="block font-black mb-1 text-white text-xs uppercase tracking-widest bg-[#7C3AED] border-2 border-black w-fit px-3 py-1 transform -rotate-1 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">{label}</label>}
      <input 
        className={`w-full bg-white dark:bg-[#1a1a1a] dark:text-white border-2 border-black dark:border-white p-4 text-xl font-bold outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] focus:shadow-[4px_4px_0px_0px_#7C3AED] transition-all placeholder:text-gray-300 ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Neo Navbar Item (Floating Style) ---
interface NeoNavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const NeoNavItem: React.FC<NeoNavItemProps> = ({ active, onClick, icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center h-12 w-16 rounded-xl transition-all duration-300 ${
        active 
        ? 'bg-[#7C3AED] text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] -translate-y-2 scale-110' 
        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <div className={`transform transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
    </button>
  );
};