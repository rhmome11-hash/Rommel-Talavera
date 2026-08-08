import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  UserPlus,
  PlusCircle,
  BarChart3,
  AlertCircle,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  ClipboardList,
  CreditCard,
  Wallet,
  Pencil,
  Trash2
} from 'lucide-react';
import { Appointment } from '../../types';

export const TodayDashboard: React.FC = () => {
  const {
    settings,
    appointments,
    setIsAppointmentModalOpen,
    setEditingAppointment,
    deleteAppointment,
    setIsClientModalOpen,
    setIsTransactionModalOpen,
    setSelectedClientId,
    setActiveTab,
    formatMoney
  } = useApp();

  // Current date formatted
  const todayStr = new Date().toISOString().split('T')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return '¡Buenos días';
    if (hour >= 12 && hour < 20) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const isNight = new Date().getHours() >= 20 || new Date().getHours() < 6;

  const getFormattedDate = () => {
    const now = new Date();
    const str = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Filter today's appointments
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  // Calculate metrics
  const totalSessions = todayAppointments.length;
  const completedSessions = todayAppointments.filter((a) => a.status === 'Completed').length;
  const expectedIncome = todayAppointments.reduce((sum, a) => sum + (a.price || 0), 0);

  // Find first session time
  const sortedTimes = [...todayAppointments].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const firstSessionTime = sortedTimes.length > 0 ? sortedTimes[0].startTime : '--:--';

  // Helper to determine time tag ("AHORA", "En X min", or status)
  const getTimeTag = (app: Appointment) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [sh, sm] = (app.startTime || '00:00').split(':').map(Number);
    const [eh, em] = (app.endTime || '23:59').split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    if (app.status === 'Completed') {
      return {
        label: 'Completado',
        bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
      };
    }

    if (app.status === 'In Progress' || (currentMinutes >= startMinutes && currentMinutes <= endMinutes)) {
      return {
        label: 'AHORA',
        bg: 'bg-emerald-500 text-zinc-950 font-black border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse'
      };
    }

    if (currentMinutes < startMinutes) {
      const diff = startMinutes - currentMinutes;
      if (diff <= 60) {
        return {
          label: `En ${diff} min`,
          bg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
        };
      }
      return {
        label: 'Próxima',
        bg: 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
      };
    }

    return {
      label: 'Pendiente',
      bg: 'bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium'
    };
  };

  const getAccentBarColor = (app: Appointment) => {
    if (app.status === 'Completed') return 'bg-emerald-500';
    if (app.status === 'In Progress') return 'bg-emerald-400';
    if (app.status === 'Cancelled') return 'bg-red-500';
    return 'bg-amber-500';
  };

  const nameToDisplay = settings.artistName || 'Vitalii';

  return (
    <div className="space-y-5 pb-24 max-w-lg mx-auto">
      {/* Centered Top Title */}
      <div className="text-center pt-1 pb-1">
        <h1 className="text-sm font-bold text-zinc-300 tracking-wide uppercase">Hoy</h1>
      </div>

      {/* Greeting Card Header */}
      <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800/80 p-5 space-y-3 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {nameToDisplay}!
            </h2>
            <p className="text-xs font-medium text-zinc-400 mt-0.5">{getFormattedDate()}</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-amber-400 shrink-0">
            {isNight ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </div>
        </div>

        {/* Sessions Banner Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/60 text-zinc-300 text-xs font-semibold">
          <CalendarIcon className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            {totalSessions === 1 ? '1 sesión hoy' : `${totalSessions} sesiones hoy`}
          </span>
        </div>
      </div>

      {/* 3 Metric Cards Grid (Needleflow style) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Card 1: Sesiones */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-white tracking-tight">
              {completedSessions} de {totalSessions}
            </div>
            <div className="text-[11px] font-medium text-zinc-400">Sesiones</div>
          </div>
        </div>

        {/* Card 2: Ingresos esperados */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-emerald-400 tracking-tight truncate">
              {formatMoney(expectedIncome)}
            </div>
            <div className="text-[11px] font-medium text-zinc-400 truncate">Ingresos esperados</div>
          </div>
        </div>

        {/* Card 3: Primera sesión */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-amber-300 tracking-tight">
              {firstSessionTime}
            </div>
            <div className="text-[11px] font-medium text-zinc-400">Primera sesión</div>
          </div>
        </div>
      </div>

      {/* Agenda de hoy Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Agenda de hoy</h3>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="bg-zinc-900/90 border border-zinc-800/80 border-dashed rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">No tienes ninguna cita agendada para hoy.</p>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Agendar cita ahora</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayAppointments.map((app) => {
              const tag = getTimeTag(app);
              const accentColor = getAccentBarColor(app);

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    if (app.clientId) {
                      setSelectedClientId(app.clientId);
                      setActiveTab('clients');
                    }
                  }}
                  className="bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                >
                  {/* Left: Time Column */}
                  <div className="flex flex-col text-left shrink-0 min-w-[48px]">
                    <span className="text-xs font-extrabold text-white">{app.startTime}</span>
                    <span className="text-[10px] text-zinc-500 font-semibold">{app.endTime}</span>
                  </div>

                  {/* Vertical Accent Line */}
                  <div className={`w-1 h-10 rounded-full shrink-0 ${accentColor}`} />

                  {/* Middle: Client Name & Service Info */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                      {app.clientName}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium truncate">
                      {app.serviceName || app.serviceType} <span className="text-emerald-400 font-bold">{formatMoney(app.price)}</span>
                    </p>
                  </div>

                  {/* Right: Actions, Tag & Arrow */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${tag.bg}`}>
                      {tag.label}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAppointment(app);
                        setIsAppointmentModalOpen(true);
                      }}
                      className="p-1 rounded-lg bg-zinc-800 hover:bg-purple-600 text-zinc-400 hover:text-white border border-zinc-700/80 transition-all"
                      title="Editar cita"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Deseas eliminar la cita de ${app.clientName}?`)) {
                          deleteAppointment(app.id);
                        }
                      }}
                      className="p-1 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white border border-zinc-700/80 transition-all"
                      title="Eliminar cita"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Section ("Acciones rápidas") */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Acciones rápidas</h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Crear cita */}
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex items-center gap-3 p-3.5 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl text-left transition-all group active:scale-98"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-100 group-hover:text-white">Crear cita</span>
          </button>

          {/* 2. Agregar cliente */}
          <button
            onClick={() => setIsClientModalOpen(true)}
            className="flex items-center gap-3 p-3.5 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl text-left transition-all group active:scale-98"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-100 group-hover:text-white">Agregar cliente</span>
          </button>

          {/* 3. Agregar gasto */}
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="flex items-center gap-3 p-3.5 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/80 hover:border-rose-500/40 rounded-2xl text-left transition-all group active:scale-98"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-100 group-hover:text-white">Agregar gasto</span>
          </button>

          {/* 4. Estadísticas */}
          <button
            onClick={() => setActiveTab('finance')}
            className="flex items-center gap-3 p-3.5 bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl text-left transition-all group active:scale-98"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-100 group-hover:text-white">Estadísticas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
