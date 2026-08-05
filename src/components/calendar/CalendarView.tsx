import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Instagram,
  Plus,
  Clock,
  Sparkles,
  CheckCircle,
  Coffee
} from 'lucide-react';
import { Appointment, ServiceType } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    settings,
    updateSettings,
    appointments,
    setIsAppointmentModalOpen,
    setIsStoryModalOpen,
    updateAppointmentStatus,
    formatMoney,
    t
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  // Generate days for Month grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  // Shift for Monday start (0=Mon, 6=Sun)
  const startDayOffset = (firstDayIndex + 6) % 7;

  const monthName = currentDate.toLocaleDateString(
    settings.language === 'es' ? 'es-ES' : 'en-US',
    { month: 'long', year: 'numeric' }
  );

  // Check if selected date is Day Off
  const isSelectedDayOff = settings.dayOffs?.includes(selectedDateStr);

  const toggleDayOff = () => {
    const currentOffs = settings.dayOffs || [];
    let updated: string[];
    if (isSelectedDayOff) {
      updated = currentOffs.filter((d) => d !== selectedDateStr);
    } else {
      updated = [...currentOffs, selectedDateStr];
    }
    updateSettings({ dayOffs: updated });
  };

  // Get appointments for selected date
  const dayAppointments = appointments.filter((a) => a.date === selectedDateStr);

  const getServiceColor = (type: ServiceType) => {
    switch (type) {
      case 'Tattoo':
        return '#A855F7';
      case 'Piercing':
        return '#10B981';
      case 'Laser':
        return '#F59E0B';
      case 'Touch-up':
        return '#38BDF8';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Calendar Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white capitalize">{monthName}</h2>
            <p className="text-xs text-zinc-400">
              {dayAppointments.length} {t('sessionsToday')} el {selectedDateStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode toggle */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                  viewMode === mode
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t(mode === 'month' ? 'viewMonth' : mode === 'week' ? 'viewWeek' : 'viewDay')}
              </button>
            ))}
          </div>

          {/* Share on Instagram Button */}
          <button
            onClick={() => setIsStoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-pink-950/30 hover:opacity-95 transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span className="hidden sm:inline">{t('shareInstagram')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-purple-300 transition-colors"
          >
            Hoy
          </button>
        </div>

        {/* Day Off Button */}
        <button
          onClick={toggleDayOff}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            isSelectedDayOff
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-amber-500/40'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>{isSelectedDayOff ? 'Quitar Día Libre' : t('markDayOff')}</span>
        </button>
      </div>

      {/* Month Grid View */}
      {viewMode === 'month' && (
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-2">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty offset padding */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="h-16 sm:h-20 rounded-xl bg-zinc-950/30 opacity-20" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isDayOff = settings.dayOffs?.includes(dateStr);

              // Appointments on this day
              const dayApps = appointments.filter((a) => a.date === dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between transition-all text-left relative overflow-hidden ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg shadow-purple-950/50 ring-2 ring-purple-500/40'
                      : isToday
                      ? 'bg-zinc-800/90 border-purple-400/80 text-purple-200'
                      : isDayOff
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-black ${isToday ? 'text-purple-300' : ''}`}>
                      {dayNum}
                    </span>
                    {isDayOff && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold">
                        OFF
                      </span>
                    )}
                  </div>

                  {/* Dots for appointment types */}
                  <div className="flex items-center gap-1 flex-wrap mt-auto">
                    {dayApps.slice(0, 4).map((app) => (
                      <span
                        key={app.id}
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: getServiceColor(app.serviceType) }}
                        title={`${app.clientName} (${app.serviceType})`}
                      />
                    ))}
                    {dayApps.length > 4 && (
                      <span className="text-[9px] font-bold text-zinc-400">
                        +{dayApps.length - 4}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Week / Day simple list view */}
      {viewMode !== 'month' && (
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-zinc-400 text-sm">
          Vista {viewMode === 'week' ? 'Semanal' : 'Diaria'} activada para {selectedDateStr}
        </div>
      )}

      {/* Selected Day Agenda Detail */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <span>Agenda del día: {selectedDateStr}</span>
            {isSelectedDayOff && (
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold">
                {t('dayOffLabel')}
              </span>
            )}
          </h3>

          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Cita</span>
          </button>
        </div>

        {dayAppointments.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 text-center space-y-2">
            <p className="text-sm text-zinc-400">Sin citas agendadas para esta fecha.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayAppointments.map((app) => (
              <div
                key={app.id}
                className="bg-zinc-900 border border-zinc-800/80 hover:border-purple-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center min-w-[65px]">
                    <span className="text-xs font-bold text-purple-300 block">{app.startTime}</span>
                    <span className="text-[10px] text-zinc-500">{app.endTime}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{app.clientName}</h4>
                    <p className="text-xs text-purple-400 font-medium">{app.serviceName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-emerald-400">{formatMoney(app.price)}</span>
                  <div className="flex gap-1">
                    {app.status !== 'Completed' && (
                      <button
                        onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                        className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 transition-colors"
                        title="Marcar completado"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
