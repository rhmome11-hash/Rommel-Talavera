import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Instagram, Download, Sparkles, Copy, Check } from 'lucide-react';

export const InstagramStoryModal: React.FC = () => {
  const { settings, appointments, isStoryModalOpen, setIsStoryModalOpen, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter((a) => a.date === todayStr);

  if (!isStoryModalOpen) return null;

  const handleCopyText = () => {
    const text = `🔥 CITAS DE HOY EN ${settings.studioName.toUpperCase()} 🔥\n\n${todayApps
      .map((a) => `⏰ ${a.startTime} - ${a.serviceType}: ${a.serviceName}`)
      .join('\n')}\n\n📲 Reserva tu cita por DM en Instagram!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Texto copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-sm bg-zinc-950 border border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
            <Instagram className="w-4 h-4" />
            <span>Instagram Story Generator</span>
          </div>
          <button
            onClick={() => setIsStoryModalOpen(false)}
            className="p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Card Mockup (9:16 Aspect Ratio Look) */}
        <div className="relative aspect-[9/16] rounded-2xl bg-gradient-to-b from-zinc-950 via-purple-950/60 to-zinc-950 border border-purple-500/40 p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>{settings.studioName}</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight pt-1">
              AGENDA DE HOY
            </h3>
            <p className="text-[11px] text-purple-300 font-medium">{todayStr}</p>
          </div>

          {/* Middle App Slots */}
          <div className="relative z-10 space-y-2.5 my-auto py-2">
            {todayApps.length === 0 ? (
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-purple-500/30 text-center">
                <p className="text-xs text-purple-200 font-bold">¡HUECOS DISPONIBLES HOY!</p>
                <p className="text-[10px] text-zinc-400 mt-1">Escríbenos por privado para reservar</p>
              </div>
            ) : (
              todayApps.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-zinc-900/90 border border-purple-500/30 backdrop-blur-md flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-1 rounded bg-purple-950 border border-purple-500/40 font-black text-purple-300 text-[11px]">
                      {a.startTime}
                    </span>
                    <div>
                      <span className="font-bold text-white block truncate max-w-[140px]">
                        {a.serviceName}
                      </span>
                      <span className="text-[10px] text-purple-400">{a.serviceType}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                    RESERVADO
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Story Footer Call to Action */}
          <div className="relative z-10 text-center pt-2 border-t border-purple-500/30">
            <p className="text-xs font-black text-white">¿QUIERES UN TATUAJE O PIERCING?</p>
            <p className="text-[10px] text-purple-300">¡Envíanos un DM para agendar tu cita! 📩</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2">
          <button
            onClick={handleCopyText}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto para Publicación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
