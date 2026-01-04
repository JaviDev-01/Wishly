import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import HomeView from './components/views/HomeView';
import AddView from './components/views/AddView';
import ListView from './components/views/ListView';
import ProfileView from './components/views/ProfileView';
import { NeoNavItem } from './components/ui/NeoComponents';
import { Birthday, Tab } from './types';
import { Home, PlusSquare, List, User } from 'lucide-react';
import { compressBirthdays, decompressBirthdays, encryptData, decryptData, sortBirthdays } from './utils';
import { NotificationService } from './notifications';
import { OtaService } from './ota';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

const STORAGE_KEY_USER = 'cb_user';
const STORAGE_KEY_USER_DOB = 'cb_user_dob'; // New key for user birthday
const STORAGE_KEY_DATA = 'cb_data';
const STORAGE_KEY_THEME = 'cb_theme';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userDOB, setUserDOB] = useState<string | null>(null); // State for user DOB
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  
  // Performance: Memoize sorted birthdays to avoid re-sorting on every render
  const sortedBirthdays = React.useMemo(() => sortBirthdays(birthdays), [birthdays]);
  
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  // Load data and theme on mount
  useEffect(() => {
    const initApp = async () => {
        try {
            // CRITICAL: Notify native plugin that the bundle loaded successfully
            // ensuring it doesn't rollback after 10s.
            await CapacitorUpdater.notifyAppReady();
        } catch (e) {
            console.error("Error notifying app ready", e);
        }

        await NotificationService.init();
        
        // Check for OTA updates
        const hasUpdate = await OtaService.checkForUpdates();
        if (hasUpdate) {
            setShowUpdateToast(true);
        }
        
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedUserDOB = localStorage.getItem(STORAGE_KEY_USER_DOB);
        const storedData = localStorage.getItem(STORAGE_KEY_DATA);
        const storedTheme = localStorage.getItem(STORAGE_KEY_THEME);

        if (storedUser) setUserName(storedUser);
        if (storedUserDOB) setUserDOB(storedUserDOB);
        
        if (storedData) {
        try {
            // Try decrypting first
            let parsed = decryptData(storedData);
            
            // If decryption returned null, it might be old plain JSON, so try parsing directly
            if (!parsed) {
                parsed = JSON.parse(storedData);
            }

            const loadedBirthdays = decompressBirthdays(parsed);
            setBirthdays(loadedBirthdays);
            // Reschedule all to ensure consistency
            NotificationService.rescheduleAll(loadedBirthdays);
        } catch (e) {
            console.error("Error loading data", e);
            setBirthdays([]);
        }
        }
        
        if (storedTheme === 'dark') {
            setIsDark(true);
        }
        
        setLoading(false);
    };

    initApp();
  }, []);

  // Theme Effect
  useEffect(() => {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDark]);

  // Save data whenever it changes
  useEffect(() => {
    if (!loading) {
      const compressed = compressBirthdays(birthdays);
      const encrypted = encryptData(compressed);
      localStorage.setItem(STORAGE_KEY_DATA, encrypted);
    }

  }, [birthdays, loading]);

  const handleUserSet = (name: string, dob: string) => {
    setUserName(name);
    setUserDOB(dob);
    localStorage.setItem(STORAGE_KEY_USER, name);
    localStorage.setItem(STORAGE_KEY_USER_DOB, dob);
  };

  const handleAddBirthday = (birthday: Birthday) => {
    setBirthdays(prev => [...prev, birthday]);
    // Schedule notification
    NotificationService.scheduleBirthdayNotification(birthday);
    setActiveTab('home');
  };

  const handleDeleteBirthday = (id: string) => {
      setBirthdays(prev => prev.filter(b => b.id !== id));
      // Cancel notification
      NotificationService.cancelBirthdayNotification(id);
  };

  const handleLogout = () => {
    setUserName(null);
    setUserDOB(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_USER_DOB);
    window.location.reload(); // Hard refresh to ensure clean state
  };

  const handleClearData = () => {
    setBirthdays([]);
    localStorage.removeItem(STORAGE_KEY_DATA);
    // Clear all notifications logic if needed, but for now we rely on re-sync or individual cancel?
    // Actually, we should probably clear all notifications here.
    // Since we don't have a 'clearAll' exposed and 'birthdays' is about to be empty, 
    // we can iterate the CURRENT birthdays before state update to cancel them.
    birthdays.forEach(b => NotificationService.cancelBirthdayNotification(b.id));
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (loading) return null;

  if (!userName) {
    return <Onboarding onComplete={handleUserSet} />;
  }

  return (
    <div className="max-w-md mx-auto h-[100dvh] relative shadow-2xl overflow-hidden flex flex-col border-x-2 border-black dark:border-white transition-colors duration-300">
      {/* 
        CRITICAL FIX FOR SCROLLING:
        - main needs overflow-hidden to prevent double scrollbars.
        - relative allows absolute positioning of inner content if needed.
        - The actual scrolling happens INSIDE the Views (HomeView, ListView, etc).
      */}
      <main className="flex-1 relative overflow-hidden w-full h-full">
        <div key={activeTab} className="animate-fade-in-up w-full h-full absolute inset-0">
          {activeTab === 'home' && (
            <HomeView 
              userName={userName} 
              userDOB={userDOB}
              birthdays={sortedBirthdays} 
              onAddClick={() => setActiveTab('add')} 
            />
          )}
          {activeTab === 'add' && (
            <AddView 
              onAdd={handleAddBirthday} 
              onCancel={() => setActiveTab('home')} 
            />
          )}
          {activeTab === 'list' && (
            <ListView 
              birthdays={sortedBirthdays} 
              onDelete={handleDeleteBirthday} 
            />
          )}
          {activeTab === 'profile' && (
            <ProfileView 
              userName={userName} 
              userDOB={userDOB}
              count={birthdays.length} 
              onLogout={handleLogout}
              onClearData={handleClearData}
              toggleTheme={toggleTheme}
              isDark={isDark}
              birthdays={birthdays}
            />
          )}
        </div>
      </main>

      {/* Update Toast */}
      {showUpdateToast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-pop">
          <div className="bg-black dark:bg-white text-white dark:text-black p-4 rounded-xl shadow-lg border-2 border-[#A3E635] flex items-center justify-between gap-3">
             <div className="flex flex-col">
                <span className="font-bold text-sm uppercase tracking-wider">Actualización Lista</span>
                <span className="text-xs opacity-80">Nueva versión disponible 🚀</span>
             </div>
             <button 
               onClick={() => OtaService.applyUpdate()}
               className="bg-[#A3E635] text-black font-bold text-xs px-3 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all uppercase tracking-wide"
             >
               Actualizar
             </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-0 w-full z-50 pointer-events-none flex justify-center">
        <nav className="pointer-events-auto bg-white dark:bg-[#111] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#7C3AED] rounded-2xl p-2 flex items-center justify-around gap-2 w-[90%] max-w-[380px] transition-all">
            <NeoNavItem 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<Home size={24} strokeWidth={2.5} />} 
            label="Home"
            />
            <NeoNavItem 
            active={activeTab === 'add'} 
            onClick={() => setActiveTab('add')} 
            icon={<PlusSquare size={24} strokeWidth={2.5} />} 
            label="Add"
            />
            <NeoNavItem 
            active={activeTab === 'list'} 
            onClick={() => setActiveTab('list')} 
            icon={<List size={24} strokeWidth={2.5} />} 
            label="List"
            />
            <NeoNavItem 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<User size={24} strokeWidth={2.5} />} 
            label="Me"
            />
        </nav>
      </div>
    </div>
  );
};

export default App;