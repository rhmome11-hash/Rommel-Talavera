import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  Gift,
  RefreshCw,
  Search,
  CheckCircle,
  Calendar,
  CreditCard,
  Trash2,
  PieChart,
  Trophy,
  Crown,
  Medal,
  Award,
  Users,
  ChevronRight,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { TransactionType, RankingMetric, RankingPeriod } from '../../types';
import { computeClientRankings } from '../../utils/ranking';

export const FinanceView: React.FC = () => {
  const {
    transactions,
    recurring,
    vouchers,
    appointments,
    clients,
    setSelectedClientId,
    setIsTransactionModalOpen,
    setIsVoucherModalOpen,
    toggleRecurringPaid,
    redeemVoucher,
    deleteTransaction,
    formatMoney,
    t
  } = useApp();

  const [subTab, setSubTab] = useState<'transactions' | 'analytics' | 'recurring' | 'vouchers'>('transactions');
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics Ranking Filters
  const [rankingMetric, setRankingMetric] = useState<RankingMetric>('spent');
  const [rankingPeriod, setRankingPeriod] = useState<RankingPeriod>('all');

  // Voucher redeem state
  const [redeemVoucherId, setRedeemVoucherId] = useState<string | null>(null);
  const [redeemAmount, setRedeemAmount] = useState('');

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  // Filtered transactions list
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'All' || t.type === filterType;
    const matchesSearch =
      t.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Analytics by service category
  const categoryBreakdown: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'Income')
    .forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

  // Calculate Appointment Metrics (Week, Month, Year, Total)
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Week bounds (Monday to Sunday)
  const dayOfWeek = todayLocal.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(todayLocal);
  monday.setDate(todayLocal.getDate() - daysSinceMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekAppointments = appointments.filter((a) => {
    if (!a.date) return false;
    const d = parseLocalDate(a.date);
    return d >= monday && d <= sunday;
  });

  const monthAppointments = appointments.filter((a) => {
    if (!a.date) return false;
    const d = parseLocalDate(a.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const yearAppointments = appointments.filter((a) => {
    if (!a.date) return false;
    const d = parseLocalDate(a.date);
    return d.getFullYear() === now.getFullYear();
  });

  const weekCompleted = weekAppointments.filter((a) => a.status === 'Completed').length;
  const monthCompleted = monthAppointments.filter((a) => a.status === 'Completed').length;
  const yearCompleted = yearAppointments.filter((a) => a.status === 'Completed').length;

  const weekValue = weekAppointments.reduce((acc, a) => acc + (a.price || 0), 0);
  const monthValue = monthAppointments.reduce((acc, a) => acc + (a.price || 0), 0);
  const yearValue = yearAppointments.reduce((acc, a) => acc + (a.price || 0), 0);

  // Compute Client Rankings for Analytics
  const rankedClients = computeClientRankings(
    clients,
    appointments,
    transactions,
    rankingMetric,
    rankingPeriod
  );

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-zinc-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
          icon: <Crown className="w-4 h-4 text-zinc-950 fill-zinc-950" />,
          label: '1º LUGAR'
        };
      case 2:
        return {
          bg: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 text-zinc-950 border-slate-200',
          icon: <Award className="w-4 h-4 text-zinc-950" />,
          label: '2º LUGAR'
        };
      case 3:
        return {
          bg: 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-amber-200 border-amber-600/60',
          icon: <Medal className="w-4 h-4 text-amber-300" />,
          label: '3º LUGAR'
        };
      default:
        return {
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          icon: <span className="font-bold text-xs">#{rank}</span>,
          label: `#${rank}`
        };
    }
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (redeemVoucherId && Number(redeemAmount) > 0) {
      redeemVoucher(redeemVoucherId, Number(redeemAmount));
      setRedeemVoucherId(null);
      setRedeemAmount('');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Finance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t('financeTitle')}</h2>
            <p className="text-xs text-zinc-400">Control de ingresos, gastos y bonos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVoucherModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-purple-300 font-semibold text-xs transition-all"
          >
            <Gift className="w-4 h-4 text-purple-400" />
            <span>Crear Bono</span>
          </button>

          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newTransaction')}</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Gross Income */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-medium">{t('summaryGross')}</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {formatMoney(totalIncome)}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-medium">{t('summaryExpenses')}</span>
            <div className="text-2xl font-bold text-red-400 mt-1">
              {formatMoney(totalExpense)}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-red-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
              {t('summaryNet')}
            </span>
            <div className="text-2xl font-bold text-purple-200 mt-1">
              {formatMoney(netProfit)}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-zinc-800 gap-1 overflow-x-auto pb-1">
        {[
          { id: 'transactions', label: t('tabTransactions'), icon: <CreditCard className="w-4 h-4" /> },
          { id: 'analytics', label: t('tabAnalytics'), icon: <PieChart className="w-4 h-4" /> },
          { id: 'recurring', label: t('recurringExpenses'), icon: <RefreshCw className="w-4 h-4" /> },
          { id: 'vouchers', label: t('giftVouchers'), icon: <Gift className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              subTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-tab 1: Transactions */}
      {subTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Type filter */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold">
              {(['All', 'Income', 'Expense'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterType === type ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {type === 'All' ? t('filterAll') : type === 'Income' ? t('filterIncome') : t('filterExpense')}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar transacción..."
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      tx.type === 'Income'
                        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                        : 'bg-red-950/80 border-red-500/40 text-red-400'
                    }`}
                  >
                    {tx.type === 'Income' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{tx.concept}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="px-2 py-0.2 rounded bg-zinc-800 text-zinc-300 font-medium">
                        {tx.category}
                      </span>
                      <span className="text-zinc-500">({tx.paymentMethod})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-black ${
                      tx.type === 'Income' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {tx.type === 'Income' ? '+' : '-'} {formatMoney(tx.amount)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Analytics */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          {/* APPOINTMENT VOLUME ANALYTICS (Semana, Mes, Año, Total) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Volumen y Estadísticas de Citas
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Esta Semana */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Citas esta Semana</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
                    Semana
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{weekAppointments.length}</span>
                  <span className="text-xs text-zinc-400">citas</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/80">
                  <span className="text-emerald-400 font-semibold">{weekCompleted} completadas</span>
                  <span className="text-zinc-400 font-bold">{formatMoney(weekValue)}</span>
                </div>
              </div>

              {/* Este Mes */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Citas este Mes</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                    Mes
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{monthAppointments.length}</span>
                  <span className="text-xs text-zinc-400">citas</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/80">
                  <span className="text-emerald-400 font-semibold">{monthCompleted} completadas</span>
                  <span className="text-zinc-400 font-bold">{formatMoney(monthValue)}</span>
                </div>
              </div>

              {/* Este Año */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Citas este Año</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    Año
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{yearAppointments.length}</span>
                  <span className="text-xs text-zinc-400">citas</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/80">
                  <span className="text-emerald-400 font-semibold">{yearCompleted} completadas</span>
                  <span className="text-zinc-400 font-bold">{formatMoney(yearValue)}</span>
                </div>
              </div>

              {/* Total Histórico */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Citas Totales</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                    Histórico
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{appointments.length}</span>
                  <span className="text-xs text-zinc-400">registradas</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/80">
                  <span className="text-emerald-400 font-semibold">
                    {appointments.filter((a) => a.status === 'Completed').length} completadas
                  </span>
                  <span className="text-zinc-400 font-bold">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESGLOSE POR SERVICIO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>Desglose de Ingresos por Categoría / Servicio</span>
            </h3>

            {Object.keys(categoryBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categoryBreakdown).map(([cat, total]) => {
                  const percentage = totalIncome > 0 ? Math.round((total / totalIncome) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-300">
                        <span>{cat}</span>
                        <span className="text-emerald-400">
                          {formatMoney(total)} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No hay transacciones de ingreso registradas para mostrar el desglose.</p>
            )}
          </div>

          {/* RANKING DE CLIENTES EN ANALÍTICAS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ranking de Clientes (Analíticas)
                </h3>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Metric Filter */}
                <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium">
                  <button
                    onClick={() => setRankingMetric('spent')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      rankingMetric === 'spent' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Mayor Gasto
                  </button>
                  <button
                    onClick={() => setRankingMetric('visits')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      rankingMetric === 'visits' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Más Visitas
                  </button>
                  <button
                    onClick={() => setRankingMetric('frequency')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      rankingMetric === 'frequency' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Más Frecuentes
                  </button>
                </div>

                {/* Period Filter */}
                <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium">
                  <button
                    onClick={() => setRankingPeriod('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      rankingPeriod === 'all' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setRankingPeriod('year')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      rankingPeriod === 'year' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Este Año
                  </button>
                  <button
                    onClick={() => setRankingPeriod('month')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      rankingPeriod === 'month' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Este Mes
                  </button>
                </div>
              </div>
            </div>

            {/* Client Ranking List */}
            {rankedClients.length > 0 ? (
              <div className="space-y-2.5">
                {rankedClients.map((item) => {
                  const badge = getRankBadge(item.rank);
                  return (
                    <div
                      key={item.client.id}
                      onClick={() => setSelectedClientId(item.client.id)}
                      className="bg-zinc-950/70 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${badge.bg}`}
                        >
                          {badge.icon}
                        </div>

                        {/* Avatar */}
                        <img
                          src={
                            item.client.avatarUrl ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${item.client.name}`
                          }
                          alt={item.client.name}
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-800 shrink-0"
                        />

                        {/* Name & Phone */}
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                            {item.client.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span>{item.client.phone}</span>
                            {item.client.instagram && (
                              <span className="text-purple-400 truncate">{item.client.instagram}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-right shrink-0">
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase font-bold">Total Invertido</span>
                          <span className="text-sm font-black text-emerald-400">
                            {formatMoney(item.totalSpent)}
                          </span>
                        </div>

                        <div className="hidden sm:block">
                          <span className="text-[10px] text-zinc-500 block uppercase font-bold">Citas</span>
                          <span className="text-xs font-bold text-zinc-200">
                            {item.totalVisits} visitas ({item.completedVisitsCount} completadas)
                          </span>
                        </div>

                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 text-center py-4">
                Aún no hay clientes registrados para mostrar en el ranking.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Recurring Expenses */}
      {subTab === 'recurring' && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-200">Gastos Recurrentes del Estudio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recurring.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-3 shadow-md"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{item.concept}</h4>
                  <p className="text-xs text-zinc-400 mt-1">Día de cobro: {item.dueDay} de cada mes</p>
                  {item.lastPaidDate && (
                    <p className="text-[10px] text-emerald-400 font-medium mt-1">
                      Último pago: {item.lastPaidDate}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-red-400">{formatMoney(item.amount)}</div>
                  <button
                    onClick={() => toggleRecurringPaid(item.id)}
                    className="mt-2 px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Pagar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Gift Vouchers */}
      {subTab === 'vouchers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200">Bonos de Regalo Emitidos</h3>
            <button
              onClick={() => setIsVoucherModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Emitir Nuevo Bono
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vouchers.map((v) => (
              <div
                key={v.id}
                className="bg-zinc-900 border border-purple-500/30 rounded-xl p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black tracking-widest text-purple-400 uppercase block">
                      {v.code}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">Cliente: {v.clientName}</h4>
                    <p className="text-xs text-zinc-400">Comprado por: {v.buyerName}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'Active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Saldo Restante</span>
                    <span className="text-lg font-black text-emerald-400">
                      {formatMoney(v.currentBalance)} / {formatMoney(v.initialValue)}
                    </span>
                  </div>

                  {v.currentBalance > 0 && (
                    <button
                      onClick={() => {
                        setRedeemVoucherId(v.id);
                        setRedeemAmount(String(v.currentBalance));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Canjear
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Redeem Voucher Drawer */}
          {redeemVoucherId && (
            <form
              onSubmit={handleRedeem}
              className="p-4 rounded-xl bg-zinc-900 border border-purple-500/50 space-y-3"
            >
              <h4 className="text-xs font-bold text-purple-300">Canjear Saldo de Bono</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  placeholder="Monto a descontar"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                >
                  Confirmar Canje
                </button>
                <button
                  type="button"
                  onClick={() => setRedeemVoucherId(null)}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
