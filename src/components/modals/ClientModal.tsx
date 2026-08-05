import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Phone, Mail, Instagram, AlertTriangle } from 'lucide-react';

export const ClientModal: React.FC = () => {
  const {
    isClientModalOpen,
    setIsClientModalOpen,
    editingClient,
    setEditingClient,
    addClient,
    updateClient,
    t
  } = useApp();

  const [name, setName] = useState(editingClient?.name || '');
  const [phone, setPhone] = useState(editingClient?.phone || '');
  const [email, setEmail] = useState(editingClient?.email || '');
  const [instagram, setInstagram] = useState(editingClient?.instagram || '');
  const [notes, setNotes] = useState(editingClient?.notes || '');
  const [medicalNotes, setMedicalNotes] = useState(editingClient?.medicalNotes || '');

  if (!isClientModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingClient) {
      updateClient({
        ...editingClient,
        name,
        phone,
        email,
        instagram,
        notes,
        medicalNotes
      });
    } else {
      addClient({
        name,
        phone,
        email,
        instagram,
        firstVisitDate: new Date().toISOString().split('T')[0],
        notes,
        medicalNotes
      });
    }

    setIsClientModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="p-4 bg-gradient-to-r from-purple-950 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            <span>{editingClient ? 'Editar Cliente' : t('btnAddClient')}</span>
          </h3>
          <button
            onClick={() => {
              setIsClientModalOpen(false);
              setEditingClient(null);
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="font-bold text-zinc-300 block mb-1">Nombre Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Laura Martínez"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-zinc-300 block mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@usuario"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="font-bold text-amber-300 flex items-center gap-1 block mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alergias / Consideraciones Médicas</span>
            </label>
            <input
              type="text"
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="Ej. Alergia al látex, piel atópica..."
              className="w-full bg-zinc-900 border border-amber-500/30 rounded-xl p-2.5 text-amber-200 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1">Notas Generales</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Estilo preferido, zona de preferencia..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsClientModalOpen(false);
                setEditingClient(null);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-950/50"
            >
              {t('save')} Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
