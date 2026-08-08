import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, User, DollarSign, Sparkles, Trash2 } from 'lucide-react';
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
    deleteAppointment,
    addClient,
    t
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [clientId, setClientId] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isQuickNewClient, setIsQuickNewClient] = useState(false);

  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Tattoo');
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:30');
  const [price, setPrice] = useState('100');
  const [deposit, setDeposit] = useState('20');
  const [notes, setNotes] = useState('');

  // Sync state when modal opens or editingAppointment changes
  useEffect(() => {
    if (editingAppointment) {
      setClientId(editingAppointment.clientId);
      setServiceName(editingAppointment.serviceName);
      setServiceType(editingAppointment.serviceType);
      setDate(editingAppointment.date);
      setStartTime(editingAppointment.startTime);
      setEndTime(editingAppointment.endTime);
      setPrice(String(editingAppointment.price));
      setDeposit(String(editingAppointment.deposit));
      setNotes(editingAppointment.notes || '');
      setIsQuickNewClient(false);
    } else {
      setClientId(clients.length > 0 ? clients[0].id : '');
      setServiceName(settings.services[0]?.name || 'Tatuaje');
      setServiceType('Tattoo');
      setDate(todayStr);
      setStartTime('12:00');
      setEndTime('13:30');
      setPrice('100');
      setDeposit('20');
      setNotes('');
      setIsQuickNewClient(clients.length === 0);
    }
  }, [editingAppointment, isAppointmentModalOpen, clients, settings, todayStr]);

  if (!isAppointmentModalOpen) return null;

  const handleDelete = () => {
    if (!editingAppointment) return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar la cita de ${editingAppointment.clientName}?`)) {
      deleteAppointment(editingAppointment.id);
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);
    }
  };

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
      status: editingAppointment ? editingAppointment.status : ('Scheduled' as const),
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

          {/* Preset Services Quick Selector */}
          {settings.services.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300 block text-[11px]">Servicios Registrados (Selección Rápida)</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {settings.services.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setServiceName(srv.name);
                      setServiceType(srv.type);
                      setPrice(String(srv.basePrice));
                    }}
                    className="px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 hover:text-white text-[11px] font-medium shrink-0 transition-all flex items-center gap-1.5"
                  >
                    <span>{srv.name}</span>
                    <span className="text-[10px] text-purple-400 font-bold">{settings.currencySymbol}{srv.basePrice}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service & Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-zinc-300 block mb-1">Tipo de Servicio</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
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
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">Detalle / Trabajo</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Ej. Corte Fade / Manicura Gel"
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
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800">
            {editingAppointment ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 font-bold text-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Cita</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAppointmentModalOpen(false);
                  setEditingAppointment(null);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 transition-colors"
              >
                {editingAppointment ? 'Guardar Cambios' : `${t('save')} Cita`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
