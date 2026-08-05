import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Store,
  User,
  DollarSign,
  Globe,
  Bell,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Palette
} from 'lucide-react';
import { ServiceType } from '../../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData, importJSON, formatMoney, t } = useApp();

  const [studioName, setStudioName] = useState(settings.studioName);
  const [artistName, setArtistName] = useState(settings.artistName);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [reminderLeadHours, setReminderLeadHours] = useState(settings.reminderLeadHours);

  // New service state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceType, setNewServiceType] = useState<ServiceType>('Tattoo');
  const [newServicePrice, setNewServicePrice] = useState('100');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      studioName,
      artistName,
      currencySymbol,
      reminderLeadHours: Number(reminderLeadHours)
    });
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    const newSrv = {
      id: `srv-${Date.now()}`,
      name: newServiceName,
      type: newServiceType,
      basePrice: Number(newServicePrice) || 0,
      durationMinutes: 60,
      color: '#A855F7'
    };
    updateSettings({
      services: [...settings.services, newSrv]
    });
    setNewServiceName('');
    setNewServicePrice('100');
  };

  const handleDeleteService = (id: string) => {
    updateSettings({
      services: settings.services.filter((s) => s.id !== id)
    });
  };

  const handleExportBackup = () => {
    const jsonStr = useApp().importJSON ? JSON.stringify(settings) : '';
    // Generate file download link
    const blob = new Blob([JSON.stringify(localStorage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TattooStudio_Pro_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        importJSON(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Settings Header */}
      <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl">
        <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">{t('settingsTitle')}</h2>
          <p className="text-xs text-zinc-400">Personaliza tu estudio, precios y datos</p>
        </div>
      </div>

      {/* Studio & Artist Info Form */}
      <form onSubmit={handleSaveInfo} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Store className="w-4 h-4 text-purple-400" />
          <span>Información General del Estudio</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">
              {t('studioName')}
            </label>
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">
              {t('artistName')}
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">
              {t('currency')}
            </label>
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-purple-500"
            >
              <option value="€">Euro (€)</option>
              <option value="$">Dólar ($)</option>
              <option value="£">Libra (£)</option>
              <option value="Mex$">Peso Mexicano (Mex$)</option>
              <option value="CLP">Peso Chileno (CLP)</option>
              <option value="COP">Peso Colombiano (COP)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">
              {t('language')}
            </label>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as 'es' | 'en' })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-purple-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
        >
          {t('save')} Cambios
        </button>
      </form>

      {/* Services & Base Prices */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <span>{t('servicesTitle')}</span>
        </h3>

        <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            placeholder="Nombre del servicio"
            className="sm:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
            required
          />
          <select
            value={newServiceType}
            onChange={(e) => setNewServiceType(e.target.value as ServiceType)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
          >
            <option value="Tattoo">Tatuaje</option>
            <option value="Piercing">Piercing</option>
            <option value="Laser">Láser</option>
            <option value="Touch-up">Repaso</option>
            <option value="Consultation">Consulta</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              placeholder="Precio"
              className="w-20 bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
              required
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0"
            >
              +
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {settings.services.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs"
            >
              <div>
                <span className="font-bold text-white">{s.name}</span>
                <span className="ml-2 px-2 py-0.5 rounded bg-zinc-800 text-purple-300 text-[10px]">
                  {s.type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-emerald-400">{formatMoney(s.basePrice)}</span>
                <button
                  onClick={() => handleDeleteService(s.id)}
                  className="text-zinc-600 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup & Import */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-purple-400" />
          <span>{t('dataBackup')}</span>
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>{t('exportData')}</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{t('importData')}</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={resetAllData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('resetData')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
