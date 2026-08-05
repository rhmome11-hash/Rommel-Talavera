import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  UserPlus,
  PlusCircle,
  TrendingUp,
  BarChart3,
  CheckCircle,
  PlayCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AppointmentStatus } from '../../types';

export const TodayDashboard: React.FC = () => {
  const {
    settings,
    appointments,
    updateAppointmentStatus,
    setIsAppointmentModalOpen,
    setIsClientModalOpen,
    setIsTransactionModalOpen,
    setSelectedClientId,
    setActiveTab,
    formatMoney,
    t
  } = useApp();

  // Current date formatted
  const todayStr = new Date().toISOString().split('T')[0];
  const dateFormatted = new Date().toLocaleDateString(
    settings.language === 'es' ? 'es-ES' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );

  // Filter today's appointments
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  // Calculate metrics
  const totalSessions = todayAppointments.length;
  const completedSessions = todayAppointments.filter((a) => a.status === 'Completed').length;
  const expectedIncome = todayAppointments.reduce((sum, a) => sum + (a.price || 0), 0);

  // Find first session time
  const sortedTimes = [...todayAppointments].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const firstSessionTime = sortedTimes.length > 0 ? sortedTimes[0].startTime : '--:--';

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Completed':
        return {
          label: t('statusCompleted'),
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          icon: <CheckCircle className="w-3.5 h-3.5" />
        };
      case 'In Progress':
        return {
          label: t('statusInProgress'),
          bg: 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
          icon: <PlayCircle className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
        };
      case 'Cancelled':
        return {
          label: t('statusCancelled'),
          bg: 'bg-red-500/15 border-red-500/40 text-red-400',
          icon: <XCircle className="w-3.5 h-3.5" />
        };
      default:
        return {
          label: t('statusScheduled'),
          bg: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
          icon: <Clock className="w-3.5 h-3.5" />
        };
    }
  };

  const getServiceTypeBg = (type: string) => {
    switch (type) {
      case 'Tattoo':
        return 'bg-purple-950/60 border-purple-500/50 text-purple-200';
      case 'Piercing':
        return 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200';
      case 'Laser':
        return 'bg-amber-950/60 border-amber-500/50 text-amber-200';
      case 'Touch-up':
        return 'bg-sky-950/60 border-sky-500/50 text-sky-200';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-purple-950/40 to-zinc-950 border border-purple-500/30 p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('tabToday')} • TattooStudio Pro</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('greetingHeader', { name: settings.artistName || 'Alex' })}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 capitalize">{dateFormatted}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('btnCreateAppointment')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Sessions Today */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>{t('sessionsToday')}</span>
            <CalendarIcon className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{totalSessions}</span>
            <span className="text-xs text-zinc-500 ml-2">citas hoy</span>
          </div>
        </div>

        {/* Expected Income */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>{t('expectedIncome')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400">{formatMoney(expectedIncome)}</span>
            <span className="text-xs text-zinc-500 ml-2">estimado</span>
          </div>
        </div>

        {/* First Session */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>{t('firstSession')}</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-purple-300">{firstSessionTime}</span>
            <span className="text-xs text-zinc-500 ml-2">inicio</span>
          </div>
        </div>

        {/* Completed Counter */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>{t('completedSessions')}</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">
              {completedSessions} <span className="text-zinc-500 font-normal text-base">/ {totalSessions}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('quickActions')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex items-center gap-3 p-3 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-purple-500/50 rounded-xl text-left transition-all active:scale-95 group"
          >
            <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-200 block">{t('btnCreateAppointment')}</span>
              <span className="text-[10px] text-zinc-500">Agendar sesión</span>
            </div>
          </button>

          <button
            onClick={() => setIsClientModalOpen(true)}
            className="flex items-center gap-3 p-3 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-purple-500/50 rounded-xl text-left transition-all active:scale-95 group"
          >
            <div className="p-2.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-200 block">{t('btnAddClient')}</span>
              <span className="text-[10px] text-zinc-500">Nuevo registro</span>
            </div>
          </button>

          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="flex items-center gap-3 p-3 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-purple-500/50 rounded-xl text-left transition-all active:scale-95 group"
          >
            <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-200 block">{t('btnAddExpense')}</span>
              <span className="text-[10px] text-zinc-500">Caja / Compras</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className="flex items-center gap-3 p-3 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-purple-500/50 rounded-xl text-left transition-all active:scale-95 group"
          >
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-200 block">{t('btnStats')}</span>
              <span className="text-[10px] text-zinc-500">Balance & Analítica</span>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <span>{t('todayAppointments')}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              {todayAppointments.length}
            </span>
          </h3>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver Agenda Completa</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 border-dashed rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-400 font-medium">{t('noAppointmentsToday')}</p>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Programar una cita ahora</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <div
                  key={app.id}
                  className="bg-zinc-900/90 border border-zinc-800/90 hover:border-purple-500/40 rounded-2xl p-4 shadow-lg transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Time Badge */}
                      <div className="flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 min-w-[70px]">
                        <span className="text-sm font-black text-purple-300">{app.startTime}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">{app.endTime}</span>
                      </div>

                      {/* Info */}
                      <div>
                        <button
                          onClick={() => {
                            if (app.clientId) {
                              setSelectedClientId(app.clientId);
                              setActiveTab('clients');
                            }
                          }}
                          className="text-base font-bold text-zinc-100 hover:text-purple-400 text-left transition-colors flex items-center gap-1.5"
                        >
                          <span>{app.clientName}</span>
                        </button>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getServiceTypeBg(
                              app.serviceType
                            )}`}
                          >
                            {app.serviceType}: {app.serviceName}
                          </span>
                          {app.notes && (
                            <span className="text-xs text-zinc-400 italic max-w-xs truncate">
                              "{app.notes}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Deposit */}
                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-emerald-400">{formatMoney(app.price)}</div>
                      {app.deposit > 0 && (
                        <div className="text-[11px] text-purple-300 font-medium">
                          Fianza: {formatMoney(app.deposit)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer status controls */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusBadge.bg}`}
                    >
                      {statusBadge.icon}
                      <span>{statusBadge.label}</span>
                    </div>

                    {/* Quick status switcher buttons */}
                    <div className="flex items-center gap-1">
                      {app.status !== 'In Progress' && app.status !== 'Completed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'In Progress')}
                          className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all"
                        >
                          En Proceso
                        </button>
                      )}
                      {app.status !== 'Completed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all"
                        >
                          Completar
                        </button>
                      )}
                      {app.status !== 'Cancelled' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'Cancelled')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-300 text-xs font-medium transition-all"
                        >
                          Cancelar
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
  );
};
