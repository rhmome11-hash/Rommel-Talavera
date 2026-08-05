import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, User, DollarSign, Sparkles } from 'lucide-react';
import { ServiceType } from '../../types';

export const AppointmentModal: React.FC = () => {
  const {
    clients,
    settings,
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    editingAppointment,
    setEditingAppointment,
    addAppointment,
    updateAppointment,
    addClient,
    t
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [clientId, setClientId] = useState(
    editingAppointment?.clientId || (clients.length > 0 ? clients[0].id : '')
  );
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isQuickNewClient, setIsQuickNewClient] = useState(clients.length === 0);

  const [serviceName, setServiceName] = useState(
    editingAppointment?.serviceName || (settings.services[0]?.name || 'Tatuaje')
  );
  const [serviceType, setServiceType] = useState<ServiceType>(
    editingAppointment?.serviceType || 'Tattoo'
  );
  const [date, setDate] = useState(editingAppointment?.date || todayStr);
  const [startTime, setStartTime] = useState(editingAppointment?.startTime || '12:00');
  const [endTime, setEndTime] = useState(editingAppointment?.endTime || '13:30');
  const [price, setPrice] = useState(String(editingAppointment?.price || 100));
  const [deposit, setDeposit] = useState(String(editingAppointment?.deposit || 20));
  const [notes, setNotes] = useState(editingAppointment?.notes || '');

  if (!isAppointmentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalClientId = clientId;
    let finalClientName = '';

    if (isQuickNewClient) {
      if (!newClientName) return;
      const created = addClient({
        name: newClientName,
        phone: newClientPhone || '+34 600 000 000',
        email: '',
        firstVisitDate: date
      });
      finalClientId = created.id;
      finalClientName = created.name;
    } else {
      const selected = clients.find((c) => c.id === clientId);
      finalClientName = selected ? selected.name : 'Cliente General';
    }

    const appPayload = {
      clientId: finalClientId,
      clientName: finalClientName,
      serviceType,
      serviceName,
      date,
      startTime,
      endTime,
      price: Number(price) || 0,
      deposit: Number(deposit) || 0,
      status: 'Scheduled' as const,
      notes,
      artistName: settings.artistName
    };

    if (editingAppointment) {
      updateAppointment({ ...editingAppointment, ...appPayload });
    } else {
      addAppointment(appPayload);
    }

    setIsAppointmentModalOpen(false);
    setEditingAppointment(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="p-4 bg-gradient-to-r from-purple-950 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{editingAppointment ? 'Editar Cita' : t('btnCreateAppointment')}</span>
          </h3>
          <button
            onClick={() => {
              setIsAppointmentModalOpen(false);
              setEditingAppointment(null);
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Client Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-zinc-300">Cliente</label>
              <button
                type="button"
                onClick={() => setIsQuickNewClient(!isQuickNewClient)}
                className="text-[11px] text-purple-400 hover:underline font-semibold"
              >
                {isQuickNewClient ? 'Seleccionar Existente' : '+ Nuevo Cliente'}
              </button>
            </div>

            {isQuickNewClient ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nombre Cliente"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                />
              </div>
            ) : (
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Service & Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-zinc-300 block mb-1">Tipo de Servicio</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              >
                <option value="Tattoo">Tatuaje</option>
                <option value="Piercing">Piercing</option>
                <option value="Laser">Láser</option>
                <option value="Touch-up">Repaso</option>
                <option value="Consultation">Consulta</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">Detalle / Zona</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Ej. Fine Line Clavícula"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-zinc-300 block mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">Inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">Fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Price & Deposit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-zinc-300 block mb-1">
                Precio Total ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">
                Fianza Pagada ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-zinc-300 block mb-1">Notas / Diseño</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones del cliente, referencia..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsAppointmentModalOpen(false);
                setEditingAppointment(null);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-950/50"
            >
              {t('save')} Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
