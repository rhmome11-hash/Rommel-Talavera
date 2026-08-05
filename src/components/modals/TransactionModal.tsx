import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TransactionType, PaymentMethod } from '../../types';

export const TransactionModal: React.FC = () => {
  const {
    settings,
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    addTransaction,
    t
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [type, setType] = useState<TransactionType>('Expense');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Insumos y Materiales');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [date, setDate] = useState(todayStr);

  if (!isTransactionModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || !amount) return;

    addTransaction({
      type,
      concept,
      amount: Number(amount) || 0,
      date,
      category,
      paymentMethod
    });

    setIsTransactionModalOpen(false);
    setConcept('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="p-4 bg-gradient-to-r from-zinc-900 via-purple-950/40 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span>{type === 'Income' ? 'Registrar Ingreso' : 'Registrar Gasto'}</span>
          </h3>
          <button
            onClick={() => setIsTransactionModalOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setType('Income');
                setCategory('Tattoo Income');
              }}
              className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                type === 'Income'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ingreso</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('Expense');
                setCategory('Insumos y Materiales');
              }}
              className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                type === 'Expense'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Gasto</span>
            </button>
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1">Concepto</label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder={type === 'Expense' ? 'Ej. Compra de Tintas' : 'Ej. Venta Tatuaje'}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-zinc-300 block mb-1">
                Monto ({settings.currencySymbol})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-zinc-300 block mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              >
                {type === 'Income' ? (
                  <>
                    <option value="Tattoo Income">Tatuaje</option>
                    <option value="Piercing Income">Piercing</option>
                    <option value="Laser Income">Láser</option>
                    <option value="Gift Voucher">Venta Bono</option>
                    <option value="Otros Ingresos">Otros</option>
                  </>
                ) : (
                  <>
                    <option value="Insumos y Materiales">Insumos y Agujas</option>
                    <option value="Alquiler Estudio">Alquiler / Licencia</option>
                    <option value="Mantenimiento Láser">Láser / Máquinas</option>
                    <option value="Servicios Básicos">Luz / Agua / Internet</option>
                    <option value="Publicidad">Marketing / RRSS</option>
                    <option value="Otros Gastos">Otros</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1">Método de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
              >
                <option value="Card">Tarjeta</option>
                <option value="Cash">Efectivo</option>
                <option value="Bizum/Transfer">Bizum / Transferencia</option>
                <option value="Voucher">Bono / Regalo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsTransactionModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-white font-bold shadow-lg ${
                type === 'Income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              Guardar Transacción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
