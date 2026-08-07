import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProfessionType } from '../../types';
import { getDefaultServicesForProfession } from '../../data/initialData';
import { Scissors, Palette, Sparkles, Gem, Building2, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const OnboardingModal: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [artistName, setArtistName] = useState(settings.artistName || '');
  const [studioName, setStudioName] = useState(settings.studioName || '');
  const [profession, setProfession] = useState<ProfessionType>(settings.profession || 'tattoo');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || '€');

  // If already onboarded and studioName is present, do not render modal
  if (settings.isOnboarded && settings.studioName) {
    return null;
  }

  const professionsList: {
    id: ProfessionType;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    badge: string;
  }[] = [
    {
      id: 'barber',
      title: 'Barbería / Peluquería',
      subtitle: 'Cortes estilo fade, arreglo de barba, afeitados y tintes',
      icon: <Scissors className="w-6 h-6 text-blue-400" />,
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/40',
      badge: 'Barber'
    },
    {
      id: 'tattoo',
      title: 'Tatuador / Estudio Tattoo',
      subtitle: 'Piezas personalizadas, fine line, repasa, piercing y láser',
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40',
      badge: 'Tattoo'
    },
    {
      id: 'nails',
      title: 'Manicurista / Estética',
      subtitle: 'Uñas acrílicas, gel, semipermanente, pedicura y nail art',
      icon: <Gem className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/40',
      badge: 'Nails'
    },
    {
      id: 'piercing',
      title: 'Piercing & Body Art',
      subtitle: 'Perforaciones, joyería de titanio, microdermales y curas',
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
      badge: 'Piercing'
    },
    {
      id: 'general',
      title: 'Estudio General',
      subtitle: 'Gestión de agenda, clientes y finanzas para cualquier negocio',
      icon: <Building2 className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40',
      badge: 'General'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName.trim() || !studioName.trim()) {
      showToast('Por favor completa tu nombre y el del estudio', 'error');
      return;
    }

    const defaultServices = getDefaultServicesForProfession(profession);

    updateSettings({
      artistName: artistName.trim(),
      studioName: studioName.trim(),
      profession,
      currencySymbol,
      services: defaultServices,
      isOnboarded: true
    });

    showToast(`¡Bienvenido a ${studioName}! Tu estudio está listo.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto space-y-6 text-zinc-100"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Needleflow Pro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-300 bg-clip-text text-transparent">
            Bienvenido a tu Estudio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto">
            Configura tu usuario y especialidad para adaptar la aplicación a tu trabajo diario.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User & Studio Name */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Tu Nombre / Usuario Profesional</span>
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Ej. Alex Ramos / Barber King"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Nombre del Estudio / Negocio</span>
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Ej. VIP Tattoo Studio / Barbería El Clásico"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Profession Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300">
              ¿A qué se dedica tu negocio? (Selecciona para adaptar la App)
            </label>
            <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {professionsList.map((item) => {
                const isSelected = profession === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfession(item.id)}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 bg-gradient-to-r ${
                      isSelected
                        ? `${item.color} shadow-lg ring-1 ring-purple-500/50`
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-white truncate">{item.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">{item.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency selection */}
          <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl text-xs">
            <span className="font-bold text-zinc-300">Símbolo de Moneda:</span>
            <div className="flex items-center gap-1.5">
              {['€', '$', 'S/.', 'MXN$', 'COP$'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setCurrencySymbol(sym)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                    currencySymbol === sym
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-900/30 flex items-center justify-center gap-2 transition-all group"
          >
            <span>Crear e Iniciar Mi Estudio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
