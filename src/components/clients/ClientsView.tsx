import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Search,
  UserPlus,
  Crown,
  Medal,
  Calendar,
  Wallet,
  Clock,
  ChevronRight,
  Phone,
  Instagram,
  Sparkles,
  Award
} from 'lucide-react';
import { computeClientRankings } from '../../utils/ranking';
import { RankingMetric, RankingPeriod } from '../../types';

export const ClientsView: React.FC = () => {
  const {
    clients,
    appointments,
    transactions,
    setSelectedClientId,
    setIsClientModalOpen,
    formatMoney,
    t
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [metric, setMetric] = useState<RankingMetric>('spent');
  const [period, setPeriod] = useState<RankingPeriod>('all');

  // Compute rankings dynamically
  const rankedClients = computeClientRankings(clients, appointments, transactions, metric, period);

  // Filter clients list for search bar
  const filteredClients = rankedClients.filter(
    (item) =>
      item.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.phone.includes(searchTerm) ||
      (item.client.instagram && item.client.instagram.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-zinc-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]',
          icon: <Crown className="w-5 h-5 text-zinc-950 fill-zinc-950" />,
          label: '1º LUGAR'
        };
      case 2:
        return {
          bg: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 text-zinc-950 border-slate-200 shadow-[0_0_15px_rgba(203,213,225,0.4)]',
          icon: <Award className="w-5 h-5 text-zinc-950" />,
          label: '2º LUGAR'
        };
      case 3:
        return {
          bg: 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-amber-200 border-amber-600/60 shadow-[0_0_15px_rgba(180,83,9,0.3)]',
          icon: <Medal className="w-5 h-5 text-amber-300" />,
          label: '3º LUGAR'
        };
      default:
        return {
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          icon: <span className="font-black text-xs">#{rank}</span>,
          label: `#${rank}`
        };
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{t('clientsTitle')}</h2>
            <p className="text-xs text-zinc-400">Total: {clients.length} clientes registrados</p>
          </div>
        </div>

        <button
          onClick={() => setIsClientModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('btnAddClient')}</span>
        </button>
      </div>

      {/* TOP CLIENTS RANKING SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-purple-950/30 to-zinc-950 border border-purple-500/30 p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              {t('topClientsHeading')}
            </h3>
          </div>

          {/* Ranking Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Filter */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold">
              <button
                onClick={() => setMetric('spent')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  metric === 'spent' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('rankBySpent')}
              </button>
              <button
                onClick={() => setMetric('visits')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  metric === 'visits' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('rankByVisits')}
              </button>
              <button
                onClick={() => setMetric('frequency')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  metric === 'frequency' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('rankByFrequency')}
              </button>
            </div>

            {/* Time Period Filter */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold">
              <button
                onClick={() => setPeriod('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  period === 'all' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('periodAll')}
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  period === 'year' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('periodYear')}
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  period === 'month' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('periodMonth')}
              </button>
            </div>
          </div>
        </div>

        {/* Podium / Top 3 Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rankedClients.slice(0, 3).map((item) => {
            const badge = getRankBadge(item.rank);
            return (
              <div
                key={item.client.id}
                onClick={() => setSelectedClientId(item.client.id)}
                className={`relative p-4 rounded-xl border bg-zinc-900/90 hover:bg-zinc-900 transition-all cursor-pointer group shadow-xl ${
                  item.rank === 1
                    ? 'border-amber-500/50 shadow-amber-950/20 ring-1 ring-amber-500/30'
                    : item.rank === 2
                    ? 'border-slate-400/40'
                    : 'border-amber-700/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.client.avatarUrl ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${item.client.name}`
                      }
                      alt={item.client.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500/40 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {item.client.name}
                      </h4>
                      {item.client.instagram && (
                        <p className="text-[11px] text-purple-400 font-medium">
                          {item.client.instagram}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Medal position badge */}
                  <div className={`p-2 rounded-xl border flex items-center justify-center ${badge.bg}`}>
                    {badge.icon}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800 text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                      {t('totalSpentLabel')}
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatMoney(item.totalSpent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                      {t('totalVisitsLabel')}
                    </span>
                    <span className="text-sm font-bold text-zinc-200">
                      {item.totalVisits} sesiones
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ALL CLIENTS DIRECTORY */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <span>{t('allClientsList')}</span>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs">
              {filteredClients.length}
            </span>
          </h3>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchClients')}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Client List */}
        <div className="space-y-2">
          {filteredClients.map((item) => (
            <div
              key={item.client.id}
              onClick={() => setSelectedClientId(item.client.id)}
              className="bg-zinc-900/90 border border-zinc-800/80 hover:border-purple-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center font-bold text-xs text-purple-400 shrink-0">
                  #{item.rank}
                </div>

                <img
                  src={
                    item.client.avatarUrl ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${item.client.name}`
                  }
                  alt={item.client.name}
                  className="w-10 h-10 rounded-xl object-cover border border-zinc-800 shrink-0"
                />

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {item.client.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-zinc-500" />
                      {item.client.phone}
                    </span>
                    {item.client.instagram && (
                      <span className="hidden sm:flex items-center gap-1 text-purple-400">
                        <Instagram className="w-3 h-3" />
                        {item.client.instagram}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">{formatMoney(item.totalSpent)}</div>
                  <div className="text-[10px] text-zinc-500 font-medium">
                    {item.totalVisits} visitas
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
