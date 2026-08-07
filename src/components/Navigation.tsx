import React from 'react';
import { useApp, TabType } from '../context/AppContext';
import {
  Sun,
  Calendar,
  Users,
  Wallet,
  Settings,
  Plus,
  Globe,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, settings, updateSettings, setIsAppointmentModalOpen, t } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: t('tabToday'), icon: <Sun className="w-5 h-5" /> },
    { id: 'calendar', label: t('tabCalendar'), icon: <Calendar className="w-5 h-5" /> },
    { id: 'clients', label: t('tabClients'), icon: <Users className="w-5 h-5" /> },
    { id: 'finance', label: t('tabFinance'), icon: <Wallet className="w-5 h-5" /> },
    { id: 'settings', label: t('tabSettings'), icon: <Settings className="w-5 h-5" /> },
  ];

  const toggleLanguage = () => {
    const nextLang = settings.language === 'es' ? 'en' : 'es';
    updateSettings({ language: nextLang });
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-100 tracking-wide flex items-center gap-2">
              {settings.studioName || 'Mi Estudio'}
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">
              {settings.artistName || 'Profesional'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-purple-300 hover:border-zinc-700 text-xs font-semibold transition-all"
            title="Cambiar idioma / Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span className="uppercase">{settings.language || 'es'}</span>
          </button>

          {/* Quick Add Appointment Button */}
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('btnCreateAppointment')}</span>
          </button>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-purple-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-purple-500/10 border border-purple-500/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative z-10">{item.icon}</div>
                <span className="relative z-10 text-[11px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
