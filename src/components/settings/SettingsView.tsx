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
  Palette,
  Briefcase
} from 'lucide-react';
import { ServiceType, ProfessionType } from '../../types';
import { getDefaultServicesForProfession } from '../../data/initialData';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData, importJSON, formatMoney, t, showToast } = useApp();

  const [studioName, setStudioName] = useState(settings.studioName);
  const [artistName, setArtistName] = useState(settings.artistName);
  const [profession, setProfession] = useState<ProfessionType>(settings.profession || 'tattoo');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [reminderLeadHours, setReminderLeadHours] = useState(settings.reminderLeadHours);

  // New service state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceType, setNewServiceType] = useState<ServiceType>('Tattoo');
  const [newServicePrice, setNewServicePrice] = useState('50');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      studioName,
      artistName,
      profession,
      currencySymbol,
      reminderLeadHours: Number(reminderLeadHours)
    });
    showToast('Ajustes guardados correctamente');
  };

  const handleLoadProfessionPresets = () => {
    const presets = getDefaultServicesForProfession(profession);
    updateSettings({
      profession,
      services: presets
    });
    showToast('Servicios por defecto cargados para tu profesión');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    const newSrv = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      type: newServiceType,
      basePrice: Number(newServicePrice) || 0,
      durationMinutes: 45,
      color: '#A855F7'
    };
    updateSettings({
      services: [...settings.services, newSrv]
    });
    setNewServiceName('');
    setNewServicePrice('50');
    showToast('Servicio añadido');
  };

  const handleDeleteService = (id: string) => {
    updateSettings({
      services: settings.services.filter((s) => s.id !== id)
    });
    showToast('Servicio eliminado', 'info');
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(localStorage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Needleflow_Backup_${new Date().toISOString().split('T')[0]}.json`;
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
          <p className="text-xs text-zinc-400">Personaliza tu estudio, profesión, catálogo de servicios y datos</p>
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
              Especialidad / Profesión
            </label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value as ProfessionType)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-purple-500"
            >
              <option value="barber">✂️ Barbería / Peluquería</option>
              <option value="tattoo">🎨 Tatuador / Estudio Tattoo</option>
              <option value="nails">💅 Manicurista / Estética</option>
              <option value="piercing">💎 Piercing & Body Art</option>
              <option value="general">⚡ Estudio General</option>
            </select>
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
              <option value="S/.">Sol Peruano (S/.)</option>
              <option value="MXN$">Peso Mexicano (MXN$)</option>
              <option value="COP$">Peso Colombiano (COP$)</option>
              <option value="CLP">Peso Chileno (CLP)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={handleLoadProfessionPresets}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-purple-300 font-semibold text-xs border border-purple-500/30 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cargar Plantilla de Servicios Recomendada</span>
          </button>
        </div>
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
            placeholder="Nombre del servicio (Ej. Corte + Barba)"
            className="sm:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
            required
          />
          <select
            value={newServiceType}
            onChange={(e) => setNewServiceType(e.target.value as ServiceType)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
          >
            <option value="Corte">Corte</option>
            <option value="Barba">Barba</option>
            <option value="Manicura">Manicura</option>
            <option value="Pedicura">Pedicura</option>
            <option value="Tattoo">Tatuaje</option>
            <option value="Touch-up">Repaso</option>
            <option value="Piercing">Piercing</option>
            <option value="Laser">Láser</option>
            <option value="Tratamiento">Tratamiento</option>
            <option value="Consultation">Consulta</option>
            <option value="Other">Otro</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              placeholder="Precio"
              className="w-20 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
              required
            />
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0"
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
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {settings.services.length === 0 && (
            <p className="text-xs text-zinc-500 text-center py-3">
              No tienes servicios registrados. Pulsa "Cargar Plantilla de Servicios Recomendada" o añade uno.
            </p>
          )}
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs transition-all"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>{t('exportData')}</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{t('importData')}</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={resetAllData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpiar Datos del Estudio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
