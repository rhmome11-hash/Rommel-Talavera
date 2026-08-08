import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Pencil,
  BarChart2,
  Image as ImageIcon,
  Clock,
  Plus,
  Trash2,
  Camera,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Maximize2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { ServiceType } from '../../types';

export const ClientDetailModal: React.FC = () => {
  const {
    clients,
    appointments,
    selectedClientId,
    setSelectedClientId,
    deleteClient,
    addClientPhoto,
    deleteClientPhoto,
    setIsAppointmentModalOpen,
    setEditingAppointment,
    deleteAppointment,
    setEditingClient,
    setIsClientModalOpen,
    updateAppointmentStatus,
    formatMoney,
    settings
  } = useApp();

  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<ServiceType>('Tattoo');
  const [photoNotes, setPhotoNotes] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  if (!selectedClientId) return null;

  const client = clients.find((c) => c.id === selectedClientId);
  if (!client) return null;

  // Get client appointments sorted by date descending
  const clientApps = appointments
    .filter((a) => a.clientId === client.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalVisits = clientApps.length;
  const completedVisits = clientApps.filter((a) => a.status === 'Completed').length;
  const cancelledVisits = clientApps.filter((a) => a.status === 'Cancelled').length;
  const totalAmount = clientApps.reduce((sum, a) => sum + (a.price || 0), 0);

  // Compute initials for round avatar (e.g. Emma Wilson -> EW)
  const initials = client.name
    ? client.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CL';

  // Format date helper (e.g. "13 May 2026")
  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '13 May 2026';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, (m || 1) - 1, d || 1);
    return dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Compute days since previous session
  const getDaysBetween = (d1: string, d2: string) => {
    const time1 = new Date(d1).getTime();
    const time2 = new Date(d2).getTime();
    const diffDays = Math.round(Math.abs(time1 - time2) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      title: photoTitle || 'Trabajo',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        {/* Top Header Bar: < Back | Title: Client | Edit Button */}
        <div className="px-4 py-3.5 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSelectedClientId(null)}
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center transition-all active:scale-95"
            title="Volver"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-sm font-bold text-white tracking-wide">Client</h2>

          <button
            onClick={() => {
              setEditingClient(client);
              setIsClientModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-purple-300 text-xs font-semibold transition-all active:scale-95 border border-zinc-700/50"
          >
            Edit
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          {/* Centered Avatar & Name */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1 space-y-2">
            <div className="w-20 h-20 rounded-full bg-emerald-400 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20">
              {client.avatarUrl ? (
                <img
                  src={client.avatarUrl}
                  alt={client.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="text-center">
              <h1 className="text-xl font-extrabold text-white tracking-tight">{client.name}</h1>
              <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 mt-1">
                <span>{client.phone}</span>
                {client.instagram && <span className="text-purple-400">{client.instagram}</span>}
              </div>
            </div>
          </div>

          {/* Medical Notes Banner if exists */}
          {client.medicalNotes && (
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Nota Médica:</strong> {client.medicalNotes}
              </span>
            </div>
          )}

          {/* Section 1: Statistics Card */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>Statistics</span>
            </div>

            {/* 2x2 Grid Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-white">{totalVisits}</div>
                <div className="text-[11px] text-zinc-400 font-medium">Visits</div>
              </div>

              <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-white">{completedVisits}</div>
                <div className="text-[11px] text-zinc-400 font-medium">Completed</div>
              </div>

              <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-white">{cancelledVisits}</div>
                <div className="text-[11px] text-zinc-400 font-medium">Cancelled</div>
              </div>

              <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-emerald-400">
                  {formatMoney(totalAmount)}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium">Total Amount</div>
              </div>
            </div>

            {/* First Visit line */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">First Visit:</span>
              <span className="text-zinc-200 font-bold">
                {formatDateDisplay(client.firstVisitDate)}
              </span>
            </div>
          </div>

          {/* Section 2: Gallery Card */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>Gallery</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddPhotoOpen(!isAddPhotoOpen)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Subir foto</span>
                </button>
                <span className="text-xs text-purple-400 font-medium">
                  All photos ({client.photos.length}) &gt;
                </span>
              </div>
            </div>

            {/* Add Photo drawer inside Gallery */}
            {isAddPhotoOpen && (
              <form
                onSubmit={handleSavePhoto}
                className="p-3.5 rounded-xl bg-zinc-950 border border-purple-500/40 space-y-3"
              >
                <h5 className="text-xs font-bold text-purple-300">Añadir nueva foto</h5>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="Título / Zona"
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                    required
                  />
                  <select
                    value={photoCategory}
                    onChange={(e) => setPhotoCategory(e.target.value as ServiceType)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                  >
                    <option value="Tattoo">Tatuaje</option>
                    <option value="Corte">Corte</option>
                    <option value="Barba">Barba</option>
                    <option value="Piercing">Piercing</option>
                    <option value="Touch-up">Repaso</option>
                  </select>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-purple-950 file:text-purple-300 file:font-semibold"
                />

                {photoUrlInput && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-purple-500">
                    <img src={photoUrlInput} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddPhotoOpen(false)}
                    className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}

            {/* Photos thumbnail list */}
            {client.photos.length === 0 ? (
              <p className="text-xs text-zinc-500 italic py-2">Sin fotos guardadas todavía.</p>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                {client.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 group cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      onClick={() => setLightboxPhoto(photo.url)}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClientPhoto(client.id, photo.id);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-md bg-red-950/80 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Visit History Card */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Visit History</span>
              </div>

              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="px-2.5 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Nueva Cita</span>
              </button>
            </div>

            {clientApps.length === 0 ? (
              <p className="text-xs text-zinc-500 italic py-2">
                Sin historial de visitas para este cliente.
              </p>
            ) : (
              <div className="space-y-3">
                {clientApps.map((app, index) => {
                  const nextApp = clientApps[index + 1];
                  const daysSincePrev = nextApp ? getDaysBetween(app.date, nextApp.date) : null;
                  const artistName = app.artistName || settings.artistName || 'Vitalii';

                  return (
                    <div
                      key={app.id}
                      className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-3.5 space-y-2 relative"
                    >
                      {/* Top Row: Icon + Service Type, Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <MessageSquare className="w-4 h-4 text-zinc-400" />
                          <span>{app.serviceType || app.serviceName}</span>
                        </div>
                        <span className="text-xs font-medium text-zinc-400">
                          {formatDateDisplay(app.date)}
                        </span>
                      </div>

                      {/* Days since previous session badge */}
                      {daysSincePrev !== null && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                          <span>↑</span>
                          <span>
                            {daysSincePrev}{' '}
                            {daysSincePrev === 1
                              ? 'day since previous session'
                              : 'days since previous session'}
                          </span>
                        </div>
                      )}

                      {/* Artist Name & Service Detail */}
                      <div className="text-xs space-y-0.5">
                        <div className="text-zinc-400 flex items-center gap-1">
                          <span className="text-zinc-500">👤</span>
                          <span>{artistName}</span>
                        </div>
                        <div className="text-zinc-200 font-semibold">{app.serviceName}</div>
                      </div>

                      {/* Bottom Row: Price, Status & Actions */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">
                            {formatMoney(app.price)}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {app.status === 'Completed'
                              ? 'Completed'
                              : app.status === 'Cancelled'
                              ? 'Cancelled'
                              : 'Planned'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Edit cita */}
                          <button
                            onClick={() => {
                              setEditingAppointment(app);
                              setIsAppointmentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-purple-500 text-zinc-400 hover:text-purple-300 transition-all"
                            title="Editar cita"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete cita */}
                          <button
                            onClick={() => {
                              if (window.confirm('¿Eliminar cita de la agenda?')) {
                                deleteAppointment(app.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-red-400 transition-all"
                            title="Eliminar cita"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {app.status !== 'Completed' && (
                            <button
                              onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 transition-all"
                              title="Marcar completada"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions: Delete Client */}
        <div className="p-3.5 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (window.confirm(`¿Eliminar cliente ${client.name}?`)) {
                deleteClient(client.id);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Cliente</span>
          </button>

          <button
            onClick={() => setSelectedClientId(null)}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
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
