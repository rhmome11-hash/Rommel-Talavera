import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Gift } from 'lucide-react';

export const VoucherModal: React.FC = () => {
  const {
    settings,
    isVoucherModalOpen,
    setIsVoucherModalOpen,
    addVoucher,
    t
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [clientName, setClientName] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [value, setValue] = useState('100');

  if (!isVoucherModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !value) return;

    const initialValue = Number(value) || 100;
    const code = `TATTOO-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 180);

    addVoucher({
      code,
      clientName,
      buyerName: buyerName || 'Autoregalo',
      initialValue,
      currentBalance: initialValue,
      issueDate: todayStr,
      expiryDate: expDate.toISOString().split('T')[0]
    });

    setIsVoucherModalOpen(false);
    setClientName('');
    setBuyerName('');
    setValue('100');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="p-4 bg-gradient-to-r from-purple-950 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-purple-400" />
            <span>Emitir Gift Voucher / Bono</span>
          </h3>
          <button
            onClick={() => setIsVoucherModalOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="font-bold text-zinc-300 block mb-1">Nombre del Beneficiario</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Para quién es el regalo"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1">Comprador / Regalo de</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Quién paga el bono (opcional)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1">
              Valor del Bono ({settings.currencySymbol})
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="100"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-300">
            * El bono se emitirá con 180 días de validez y generará automáticamente un registro de ingreso en caja.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-950/50"
            >
              Emitir Bono
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
