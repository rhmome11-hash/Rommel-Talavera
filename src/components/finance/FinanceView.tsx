import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MoreHorizontal,
  CreditCard,
  PieChart,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart2,
  Wallet,
  RefreshCw,
  Gift,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  CheckCircle,
  Trophy,
  Crown,
  Medal,
  Award,
  CalendarDays,
  X
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
    settings,
    setSelectedClientId,
    setIsTransactionModalOpen,
    setIsVoucherModalOpen,
    toggleRecurringPaid,
    redeemVoucher,
    deleteTransaction,
    formatMoney,
    t
  } = useApp();

  // Top Tab state: Transactions vs Analytics
  const [activeMainTab, setActiveMainTab] = useState<'transactions' | 'analytics'>('transactions');

  // Filter 1: Type (All | Income | Expense)
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');

  // Filter 2: Timeframe (Week | Month | Year | All Time)
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year' | 'all'>('month');

  // Search input
  const [searchTerm, setSearchTerm] = useState('');

  // Sub-drawers for Recurring Payments & Gift Vouchers
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showVouchersModal, setShowVouchersModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Voucher redeem state
  const [redeemVoucherId, setRedeemVoucherId] = useState<string | null>(null);
  const [redeemAmount, setRedeemAmount] = useState('');

  // Analytics Ranking Filters
  const [rankingMetric, setRankingMetric] = useState<RankingMetric>('spent');
  const [rankingPeriod, setRankingPeriod] = useState<RankingPeriod>('all');

  // Date parsing helper
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

  // Timeframe filter logic for Transactions
  const filteredTimeframeTx = transactions.filter((tx) => {
    if (!tx.date) return true;
    const d = parseLocalDate(tx.date);

    if (timeframe === 'week') {
      return d >= monday && d <= sunday;
    }
    if (timeframe === 'month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (timeframe === 'year') {
      return d.getFullYear() === now.getFullYear();
    }
    return true; // all
  });

  // Calculate totals based on selected timeframe
  const totalIncome = filteredTimeframeTx
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTimeframeTx
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const grossProfit = totalIncome;
  const netProfit = totalIncome - totalExpense;

  // Final filtered transactions list for search + type
  const displayedTransactions = filteredTimeframeTx.filter((t) => {
    const matchesType = filterType === 'All' || t.type === filterType;
    const matchesSearch =
      t.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group transactions by Date
  const groupedTx: Record<string, typeof displayedTransactions> = {};
  displayedTransactions.forEach((tx) => {
    const dateKey = tx.date || 'Sin Fecha';
    if (!groupedTx[dateKey]) {
      groupedTx[dateKey] = [];
    }
    groupedTx[dateKey].push(tx);
  });

  // Helper to format date header
  const formatDateHeader = (dateStr: string) => {
    if (dateStr === 'Sin Fecha') return settings.language === 'es' ? 'Sin Fecha' : 'No Date';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, (m || 1) - 1, d || 1);
    const locale = settings.language === 'es' ? 'es-ES' : 'en-US';
    return dateObj.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      weekday: 'long'
    });
  };

  // Analytics Appointments calculations
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

  // Category breakdown for analytics
  const categoryBreakdown: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'Income')
    .forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

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
          bg: 'bg-amber-400 text-zinc-950 border-amber-300 font-black',
          icon: <Crown className="w-4 h-4 text-zinc-950 fill-zinc-950" />
        };
      case 2:
        return {
          bg: 'bg-slate-300 text-zinc-950 border-slate-200 font-black',
          icon: <Award className="w-4 h-4 text-zinc-950" />
        };
      case 3:
        return {
          bg: 'bg-amber-700 text-amber-100 border-amber-600 font-black',
          icon: <Medal className="w-4 h-4 text-amber-200" />
        };
      default:
        return {
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700 font-bold',
          icon: <span className="text-xs">#{rank}</span>
        };
    }
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (redeemVoucherId && Number(redeemAmount) > 0) {
      redeemVoucher(redeemVoucherId, Number(redeemAmount));
      setRedeemVoucherId(null);
      setRedeemAmount('');
    }
  };

  return (
    <div className="space-y-5 pb-28 max-w-md mx-auto relative">
      {/* 1. TOP HEADER: "Finance" + Options Icon */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('financeHeader')}</h1>

        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="w-10 h-10 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 hover:bg-purple-900/60 flex items-center justify-center transition-all active:scale-95 shadow-md"
            title={settings.language === 'es' ? 'Opciones' : 'Options'}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptionsMenu && (
            <div className="absolute right-0 top-12 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <button
                onClick={() => {
                  setIsTransactionModalOpen(true);
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>{t('newTransaction')}</span>
              </button>
              <button
                onClick={() => {
                  setIsVoucherModalOpen(true);
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <Gift className="w-4 h-4 text-purple-400" />
                <span>{t('newVoucher')}</span>
              </button>
              <button
                onClick={() => {
                  setShowRecurringModal(true);
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>{t('recurringPayments')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN SEGMENTED SWITCHER: [ Transactions | Analytics ] */}
      <div className="bg-zinc-900/90 border border-zinc-800/80 p-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
        <button
          onClick={() => setActiveMainTab('transactions')}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeMainTab === 'transactions'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t('tabTransactions')}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('analytics')}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeMainTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>{t('tabAnalytics')}</span>
        </button>
      </div>

      {/* 3. TRANSACTIONS TAB CONTENT */}
      {activeMainTab === 'transactions' && (
        <div className="space-y-4">
          {/* Sub-filter 1: [ All | Income | Expenses ] */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 custom-scrollbar">
            <button
              onClick={() => setFilterType('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterType === 'All'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-purple-300" />
              <span>{t('filterAll')}</span>
            </button>

            <button
              onClick={() => setFilterType('Income')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterType === 'Income'
                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 shadow-md'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{t('filterIncome')}</span>
            </button>

            <button
              onClick={() => setFilterType('Expense')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterType === 'Expense'
                  ? 'bg-red-950 border border-red-500/50 text-red-300 shadow-md'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span>{t('filterExpense')}</span>
            </button>
          </div>

          {/* Sub-filter 2: Timeframe Switcher [ Week | Month | Year | All Time ] */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-1 rounded-full flex items-center justify-between text-xs font-semibold text-zinc-400">
            {(['week', 'month', 'year', 'all'] as const).map((tPeriod) => {
              const labelMap = {
                week: t('timeframeWeek'),
                month: t('timeframeMonth'),
                year: t('timeframeYear'),
                all: t('timeframeAll')
              };
              const isSelected = timeframe === tPeriod;
              return (
                <button
                  key={tPeriod}
                  onClick={() => setTimeframe(tPeriod)}
                  className={`flex-1 py-1.5 rounded-full text-center capitalize transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white font-bold shadow-md'
                      : 'hover:text-white'
                  }`}
                >
                  {labelMap[tPeriod]}
                </button>
              );
            })}
          </div>

          {/* 4. METRICS 2X2 GRID */}
          <div className="grid grid-cols-2 gap-3">
            {/* Income */}
            <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1 shadow-md">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <ArrowDownLeft className="w-4 h-4" />
                <span>{t('incomeLabel')}</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400 tracking-tight">
                {formatMoney(totalIncome)}
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1 shadow-md">
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                <ArrowUpRight className="w-4 h-4" />
                <span>{t('expensesLabel')}</span>
              </div>
              <div className="text-xl font-extrabold text-red-400 tracking-tight">
                {formatMoney(totalExpense)}
              </div>
            </div>

            {/* Gross */}
            <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1 shadow-md">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <BarChart2 className="w-4 h-4" />
                <span>{t('grossLabel')}</span>
              </div>
              <div className="text-xl font-extrabold text-amber-300 tracking-tight">
                {formatMoney(grossProfit)}
              </div>
            </div>

            {/* Net */}
            <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1 shadow-md">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Wallet className="w-4 h-4" />
                <span>{t('netLabel')}</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400 tracking-tight">
                {formatMoney(netProfit)}
              </div>
            </div>
          </div>

          {/* 5. EXTRA FEATURE ROWS */}
          <div className="space-y-2.5 pt-1">
            {/* Recurring Payments */}
            <div
              onClick={() => setShowRecurringModal(true)}
              className="bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {t('recurringPayments')}
                  </h4>
                  <p className="text-xs text-zinc-400">{t('recurringSub')}</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Gift Vouchers */}
            <div
              onClick={() => setShowVouchersModal(true)}
              className="bg-zinc-900/90 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {t('giftVouchers')}
                  </h4>
                  <p className="text-xs text-zinc-400">{t('giftVouchersSub')}</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* 6. TRANSACTIONS LIST GROUPED BY DATE */}
          <div className="space-y-4 pt-2">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchTransactions')}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            {Object.keys(groupedTx).length === 0 ? (
              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-8 text-center space-y-1">
                <p className="text-xs text-zinc-400">{t('noTransactionsFound')}</p>
              </div>
            ) : (
              Object.entries(groupedTx).map(([dateStr, txList]) => (
                <div key={dateStr} className="space-y-2">
                  <h3 className="text-xs font-bold text-zinc-400 px-1 capitalize">
                    {formatDateHeader(dateStr)}
                  </h3>

                  <div className="space-y-2">
                    {txList.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Round icon badge */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                              tx.type === 'Income'
                                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                                : 'bg-red-950/60 border-red-500/30 text-red-400'
                            }`}
                          >
                            {tx.type === 'Income' ? (
                              <ArrowDownLeft className="w-5 h-5" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{tx.concept}</h4>
                            <p className="text-xs text-zinc-400 truncate">{tx.category}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-sm font-black ${
                              tx.type === 'Income' ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {tx.type === 'Income' ? '+' : '-'}
                            {formatMoney(tx.amount)}
                          </span>

                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                            title={t('delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 7. FLOATING ACTION BUTTON (+) */}
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-2xl shadow-purple-950/80 flex items-center justify-center transition-transform active:scale-95 border-2 border-purple-400/40"
            title={t('newTransaction')}
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* 4. ANALYTICS TAB CONTENT */}
      {activeMainTab === 'analytics' && (
        <div className="space-y-6 pt-1">
          {/* APPOINTMENT STATS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <CalendarDays className="w-4 h-4 text-purple-400" />
              <span>{t('appointmentStats')}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-2xl space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold block">{t('thisWeek')}</span>
                <div className="text-2xl font-black text-white">{weekAppointments.length} {t('citasCount')}</div>
                <div className="text-xs text-emerald-400 font-bold">{formatMoney(weekValue)}</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-2xl space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold block">{t('thisMonth')}</span>
                <div className="text-2xl font-black text-white">{monthAppointments.length} {t('citasCount')}</div>
                <div className="text-xs text-emerald-400 font-bold">{formatMoney(monthValue)}</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-2xl space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold block">{t('thisYear')}</span>
                <div className="text-2xl font-black text-white">{yearAppointments.length} {t('citasCount')}</div>
                <div className="text-xs text-emerald-400 font-bold">{formatMoney(yearValue)}</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-2xl space-y-1">
                <span className="text-[11px] text-zinc-400 font-semibold block">{t('allTimeTotal')}</span>
                <div className="text-2xl font-black text-white">{appointments.length} {t('citasCount')}</div>
                <div className="text-xs text-purple-400 font-bold">{settings.language === 'es' ? 'Total Registrado' : 'Total Recorded'}</div>
              </div>
            </div>
          </div>

          {/* DESGLOSE POR CATEGORÍA */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 space-y-3 shadow-md">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>{t('incomeByCategory')}</span>
            </h3>

            {Object.keys(categoryBreakdown).length > 0 ? (
              <div className="space-y-2.5">
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
                      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">
                {settings.language === 'es' ? 'Sin datos de ingresos por categoría.' : 'No income category data.'}
              </p>
            )}
          </div>

          {/* RANKING DE CLIENTES (ÚNICO LUGAR DONDE EXISTE) */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 space-y-4 shadow-md">
            <div className="space-y-2 pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t('topClientsHeading')}
                </h3>
              </div>

              {/* Ranking Metric & Period Switchers */}
              <div className="flex flex-col gap-2">
                {/* Metric */}
                <div className="flex items-center p-1 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] font-medium">
                  <button
                    onClick={() => setRankingMetric('spent')}
                    className={`flex-1 py-1 rounded-full text-center transition-all ${
                      rankingMetric === 'spent' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {t('rankBySpent')}
                  </button>
                  <button
                    onClick={() => setRankingMetric('visits')}
                    className={`flex-1 py-1 rounded-full text-center transition-all ${
                      rankingMetric === 'visits' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {t('rankByVisits')}
                  </button>
                  <button
                    onClick={() => setRankingMetric('frequency')}
                    className={`flex-1 py-1 rounded-full text-center transition-all ${
                      rankingMetric === 'frequency' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {t('rankByFrequency')}
                  </button>
                </div>

                {/* Period */}
                <div className="flex items-center p-1 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] font-medium">
                  <button
                    onClick={() => setRankingPeriod('all')}
                    className={`flex-1 py-1 rounded-full text-center transition-all ${
                      rankingPeriod === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {t('periodAll')}
                  </button>
                  <button
                    onClick={() => setRankingPeriod('year')}
                    className={`flex-1 py-1 rounded-full text-center transition-all ${
                      rankingPeriod === 'year' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {t('periodYear')}
                  </button>
                  <button
                    onClick={() => setRankingPeriod('month')}
                    className={`flex-1 py-1 rounded-full text-center transition-all ${
                      rankingPeriod === 'month' ? 'bg-purple-600 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {t('periodMonth')}
                  </button>
                </div>
              </div>
            </div>

            {/* Client Ranking List */}
            {rankedClients.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-2">
                {settings.language === 'es'
                  ? 'No hay suficientes datos de clientes para el ranking.'
                  : 'Not enough client data for ranking.'}
              </p>
            ) : (
              <div className="space-y-2">
                {rankedClients.map((item) => {
                  const badge = getRankBadge(item.rank);
                  return (
                    <div
                      key={item.client.id}
                      onClick={() => setSelectedClientId(item.client.id)}
                      className="bg-zinc-950/80 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Position Badge */}
                        <div
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${badge.bg}`}
                        >
                          {badge.icon}
                        </div>

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                          {item.client.avatarUrl ? (
                            <img
                              src={item.client.avatarUrl}
                              alt={item.client.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>
                              {item.client.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                            {item.client.name}
                          </h4>
                          <p className="text-[10px] text-zinc-400">
                            {item.totalVisits} {t('visits')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black text-emerald-400">
                          {formatMoney(item.totalSpent)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: RECURRING PAYMENTS */}
      {showRecurringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <RefreshCw className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">{t('recurringPayments')}</h3>
              </div>
              <button
                onClick={() => setShowRecurringModal(false)}
                className="p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {recurring.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.concept}</h4>
                    <p className="text-[11px] text-zinc-400">
                      {t('dayOfMonth').replace('{{day}}', String(item.dueDay))}
                    </p>
                    {item.lastPaidDate && (
                      <p className="text-[10px] text-emerald-400">
                        {t('lastPayment')} {item.lastPaidDate}
                      </p>
                    )}
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs font-black text-red-400 block">
                      {formatMoney(item.amount)}
                    </span>
                    <button
                      onClick={() => toggleRecurringPaid(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{t('recordPayment')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRecurringModal(false)}
              className="w-full py-2.5 rounded-2xl bg-zinc-800 text-zinc-200 text-xs font-bold"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: GIFT VOUCHERS */}
      {showVouchersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Gift className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">{t('giftVouchers')}</h3>
              </div>
              <button
                onClick={() => setShowVouchersModal(false)}
                className="p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowVouchersModal(false);
                  setIsVoucherModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                + {t('newVoucher')}
              </button>
            </div>

            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto custom-scrollbar">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className="bg-zinc-900 border border-purple-500/30 rounded-2xl p-3.5 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">
                        {v.code}
                      </span>
                      <h4 className="text-xs font-bold text-white">{v.clientName}</h4>
                      <p className="text-[10px] text-zinc-400">
                        {settings.language === 'es' ? 'Comprado por:' : 'Purchased by:'} {v.buyerName}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {v.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">{t('remainingBalance')}</span>
                      <span className="text-sm font-black text-emerald-400">
                        {formatMoney(v.currentBalance)} / {formatMoney(v.initialValue)}
                      </span>
                    </div>

                    {v.currentBalance > 0 && (
                      <button
                        onClick={() => {
                          setRedeemVoucherId(v.id);
                          setRedeemAmount(String(v.currentBalance));
                        }}
                        className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-bold"
                      >
                        {t('redeem')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Redeem Form inside Modal */}
            {redeemVoucherId && (
              <form
                onSubmit={handleRedeemSubmit}
                className="p-3 rounded-2xl bg-zinc-900 border border-purple-500/50 space-y-2"
              >
                <h4 className="text-xs font-bold text-purple-300">
                  {settings.language === 'es' ? 'Canjear Saldo' : 'Redeem Balance'}
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    placeholder={settings.language === 'es' ? 'Monto' : 'Amount'}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    {t('confirmRedeem')}
                  </button>
                </div>
              </form>
            )}

            <button
              onClick={() => setShowVouchersModal(false)}
              className="w-full py-2.5 rounded-2xl bg-zinc-800 text-zinc-200 text-xs font-bold"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
