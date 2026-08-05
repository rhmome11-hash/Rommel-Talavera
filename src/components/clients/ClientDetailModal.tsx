import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Phone,
  Mail,
  Instagram,
  Calendar,
  Trophy,
  Camera,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { computeClientRankings } from '../../utils/ranking';
import { ServiceType } from '../../types';

export const ClientDetailModal: React.FC = () => {
  const {
    clients,
    appointments,
    transactions,
    selectedClientId,
    setSelectedClientId,
    deleteClient,
    addClientPhoto,
    deleteClientPhoto,
    setIsAppointmentModalOpen,
    setEditingClient,
    setIsClientModalOpen,
    formatMoney,
    t
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'photos' | 'history' | 'info'>('photos');
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // New photo form state
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<ServiceType>('Tattoo');
  const [photoNotes, setPhotoNotes] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  if (!selectedClientId) return null;

  const client = clients.find((c) => c.id === selectedClientId);
  if (!client) return null;

  // Compute rankings to get client's exact position
  const rankings = computeClientRankings(clients, appointments, transactions);
  const clientRankInfo = rankings.find((r) => r.client.id === client.id);

  // Client appointments history
  const clientApps = appointments.filter((a) => a.clientId === client.id);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrlInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl =
      photoUrlInput ||
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=500&auto=format&fit=crop&q=80';

    addClientPhoto(client.id, {
      url: finalUrl,
      title: photoTitle || 'Tatuaje / Trabajo',
      category: photoCategory,
      date: new Date().toISOString().split('T')[0],
      notes: photoNotes
    });

    setIsAddPhotoOpen(false);
    setPhotoTitle('');
    setPhotoNotes('');
    setPhotoUrlInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-purple-950 via-zinc-900 to-zinc-950 p-5 border-b border-zinc-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                client.avatarUrl ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${client.name}`
              }
              alt={client.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/50 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{client.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-bold">
                  Rank #{clientRankInfo?.rank || '-'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                <span>{client.phone}</span>
                {client.instagram && <span className="text-purple-400">{client.instagram}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedClientId(null)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900/90 border-b border-zinc-800/80 text-center text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              {t('totalSpentLabel')}
            </span>
            <span className="text-base font-black text-emerald-400">
              {formatMoney(clientRankInfo?.totalSpent || 0)}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              {t('totalVisitsLabel')}
            </span>
            <span className="text-base font-bold text-white">
              {clientRankInfo?.totalVisits || 0} sesiones
            </span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              {t('firstVisit')}
            </span>
            <span className="text-xs font-medium text-purple-300">
              {client.firstVisitDate || '2025-01-01'}
            </span>
          </div>
        </div>

        {/* Medical Notes Banner if exists */}
        {client.medicalNotes && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Alerta Médica:</strong> {client.medicalNotes}
            </span>
          </div>
        )}

        {/* Sub-tabs */}
        <div className="flex border-b border-zinc-800 px-4 mt-2">
          <button
            onClick={() => setActiveSubTab('photos')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeSubTab === 'photos'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t('photosTab')} ({client.photos.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeSubTab === 'history'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t('visitHistory')} ({clientApps.length})
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* SubTab 1: Photos */}
          {activeSubTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Trabajos realizados
                </h4>
                <button
                  onClick={() => setIsAddPhotoOpen(!isAddPhotoOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t('addPhoto')}</span>
                </button>
              </div>

              {/* Add Photo Form Drawer */}
              {isAddPhotoOpen && (
                <form
                  onSubmit={handleSavePhoto}
                  className="p-4 rounded-xl bg-zinc-900 border border-purple-500/40 space-y-3"
                >
                  <h5 className="text-xs font-bold text-purple-300">Añadir nueva foto de trabajo</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                        Título / Zona
                      </label>
                      <input
                        type="text"
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="Ej. Manga Blackwork Antebrazo"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                        Categoría
                      </label>
                      <select
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value as ServiceType)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                      >
                        <option value="Tattoo">Tatuaje</option>
                        <option value="Piercing">Piercing</option>
                        <option value="Laser">Láser</option>
                        <option value="Touch-up">Repaso</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Seleccionar de Galería o Cámara
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-950 file:text-purple-300 file:font-semibold hover:file:bg-purple-900"
                    />
                  </div>

                  {photoUrlInput && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-purple-500">
                      <img src={photoUrlInput} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddPhotoOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold"
                    >
                      Guardar Foto
                    </button>
                  </div>
                </form>
              )}

              {/* Photos Grid */}
              {client.photos.length === 0 ? (
                <p className="text-xs text-zinc-500 italic text-center py-6">
                  No hay fotos asociadas a este cliente.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {client.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-square"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2.5 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white truncate">{photo.title}</span>
                        <span className="text-[10px] text-purple-300 font-medium">
                          {photo.category} • {photo.date}
                        </span>
                      </div>

                      {/* Lightbox Trigger */}
                      <button
                        onClick={() => setLightboxPhoto(photo.url)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete photo button */}
                      <button
                        onClick={() => deleteClientPhoto(client.id, photo.id)}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-950/80 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SubTab 2: History */}
          {activeSubTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Historial de Citas
                </h4>
                <button
                  onClick={() => {
                    setSelectedClientId(null);
                    setIsAppointmentModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Programar Nueva Cita
                </button>
              </div>

              {clientApps.length === 0 ? (
                <p className="text-xs text-zinc-500 italic text-center py-6">
                  Sin sesiones registradas para este cliente.
                </p>
              ) : (
                <div className="space-y-2">
                  {clientApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{app.serviceName}</div>
                        <div className="text-zinc-400 text-[11px] mt-0.5">
                          {app.date} • {app.startTime} - {app.endTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-emerald-400">{formatMoney(app.price)}</div>
                        <div className="text-[10px] text-purple-300 font-medium">{app.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <button
            onClick={() => {
              deleteClient(client.id);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Cliente</span>
          </button>

          <button
            onClick={() => setSelectedClientId(null)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl cursor-pointer"
        >
          <img
            src={lightboxPhoto}
            alt="Full Lightbox"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
