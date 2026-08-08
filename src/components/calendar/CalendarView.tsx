import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Plus,
  Coffee,
  CheckCircle,
  Clock,
  Pencil,
  Trash2
} from 'lucide-react';
import { Appointment, ServiceType } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    settings,
    updateSettings,
    appointments,
    setIsAppointmentModalOpen,
    setEditingAppointment,
    deleteAppointment,
    setIsStoryModalOpen,
    setSelectedClientId,
    setActiveTab,
    updateAppointmentStatus,
    formatMoney
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');

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

  // Month title formatted (e.g. "Junio 2026")
  const monthTitle = currentDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });
  const formattedMonthTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

  // Selected date formatted (e.g. "16 Junio, Martes")
  const [sYear, sMonth, sDay] = selectedDateStr.split('-').map(Number);
  const selectedDateObj = new Date(sYear, (sMonth || 1) - 1, sDay || 1);
  const selectedDateFormatted = `${sDay} ${selectedDateObj.toLocaleDateString('es-ES', {
    month: 'long'
  })}, ${selectedDateObj.toLocaleDateString('es-ES', { weekday: 'long' })}`;
  const formattedSelectedHeader =
    selectedDateFormatted.charAt(0).toUpperCase() + selectedDateFormatted.slice(1);

  // Day Off toggle
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

  // Appointments for selected date
  const dayAppointments = appointments
    .filter((a) => a.date === selectedDateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Service colors for legend & rings
  const getServiceColor = (type: string) => {
    switch (type) {
      case 'Tattoo':
      case 'Corte':
        return '#38BDF8'; // Sky Blue
      case 'Touch-up':
      case 'Barba':
        return '#F59E0B'; // Amber
      case 'Consultation':
      case 'Tratamiento':
        return '#10B981'; // Emerald Green
      case 'Piercing':
      case 'Manicura':
        return '#EC4899'; // Pink
      default:
        return '#A855F7'; // Purple
    }
  };

  const getServiceBarColor = (type: string) => {
    switch (type) {
      case 'Tattoo':
      case 'Corte':
        return 'bg-sky-400';
      case 'Touch-up':
      case 'Barba':
        return 'bg-amber-400';
      case 'Consultation':
      case 'Tratamiento':
        return 'bg-emerald-400';
      case 'Piercing':
      case 'Manicura':
        return 'bg-pink-400';
      default:
        return 'bg-purple-400';
    }
  };

  // Week View calculation (Monday to Sunday around selectedDateObj)
  const getWeekDays = () => {
    const dayOfWeek = selectedDateObj.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(selectedDateObj);
    monday.setDate(selectedDateObj.getDate() - daysSinceMonday);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto">
      {/* Top Header Bar: Today pill | Month Year | Plus Button */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button
          onClick={handleToday}
          className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-purple-300 font-bold text-xs transition-all active:scale-95 shadow-md"
        >
          Hoy
        </button>

        <h2 className="text-sm font-extrabold text-white tracking-wide">
          {formattedMonthTitle}
        </h2>

        <button
          onClick={() => setIsAppointmentModalOpen(true)}
          className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-purple-600 flex items-center justify-center transition-all active:scale-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* View Segmented Switcher (Day / Week / Month) */}
      <div className="p-1 rounded-full bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between text-xs font-semibold">
        <button
          onClick={() => setViewMode('day')}
          className={`flex-1 py-1.5 rounded-full text-center transition-all ${
            viewMode === 'day'
              ? 'bg-zinc-800 text-white font-bold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Día
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`flex-1 py-1.5 rounded-full text-center transition-all ${
            viewMode === 'week'
              ? 'bg-zinc-800 text-white font-bold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`flex-1 py-1.5 rounded-full text-center transition-all ${
            viewMode === 'month'
              ? 'bg-zinc-800 text-white font-bold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Mes
        </button>
      </div>

      {/* Month View Content */}
      {viewMode === 'month' && (
        <div className="space-y-4">
          {/* Month Navigation Arrows */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-zinc-300">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-zinc-800 text-purple-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-extrabold text-white">{formattedMonthTitle}</span>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-zinc-800 text-purple-400 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Month Calendar Grid */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-4 shadow-xl space-y-3">
            {/* Weekday Labels (M T W T F S S) */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold text-zinc-400 uppercase">
              <span>L</span>
              <span>M</span>
              <span>X</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
              <span>D</span>
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-y-3 gap-x-1 justify-items-center">
              {/* Empty padding */}
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="w-10 h-10" />
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
                const hasApps = dayApps.length > 0;

                // Primary ring color if has appointments
                const primaryColor = hasApps ? getServiceColor(dayApps[0].serviceType) : null;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className="flex flex-col items-center justify-center relative focus:outline-none"
                  >
                    {/* Circle Container */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all relative ${
                        isSelected
                          ? 'bg-sky-500 text-zinc-950 font-black shadow-[0_0_12px_rgba(56,189,248,0.6)] ring-2 ring-sky-300'
                          : isToday
                          ? 'bg-zinc-800 text-sky-400 border-2 border-sky-400'
                          : isDayOff
                          ? 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                          : 'bg-zinc-950/60 text-zinc-300 hover:bg-zinc-800 border border-transparent'
                      }`}
                      style={
                        !isSelected && hasApps
                          ? {
                              boxShadow: `0 0 0 2px ${primaryColor}40`,
                              borderColor: primaryColor || '#38BDF8'
                            }
                          : {}
                      }
                    >
                      <span>{dayNum}</span>
                    </div>

                    {/* Sub label: OFF or dot count */}
                    {isDayOff && !isSelected && (
                      <span className="text-[8px] font-black text-sky-400 uppercase tracking-tighter mt-0.5">
                        OFF
                      </span>
                    )}

                    {!isDayOff && hasApps && !isSelected && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayApps.slice(0, 3).map((app, idx) => (
                          <span
                            key={idx}
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: getServiceColor(app.serviceType) }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Service Category Legend */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-3 text-[11px] font-semibold text-zinc-400 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Tattoo / Corte</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Touch-up / Barba</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Consulta</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Otro</span>
              </div>
            </div>
          </div>

          {/* Share to Instagram Button */}
          <button
            onClick={() => setIsStoryModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-950/90 via-purple-900/80 to-purple-950/90 border border-purple-500/30 hover:border-purple-400 text-purple-200 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Instagram className="w-4 h-4 text-purple-300" />
            <span>Compartir en Instagram</span>
          </button>
        </div>
      )}

      {/* Week View Content */}
      {viewMode === 'week' && (
        <div className="space-y-3 bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300 pb-2 border-b border-zinc-800">
            <span>Semana Actual</span>
            <button
              onClick={toggleDayOff}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                isSelectedDayOff
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
            >
              <Coffee className="w-3 h-3" />
              <span>{isSelectedDayOff ? 'Quitar Día Libre' : 'Marcar Día Libre'}</span>
            </button>
          </div>

          {/* 7 Days Strip */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {getWeekDays().map((d) => {
              const dStr = d.toISOString().split('T')[0];
              const isSel = dStr === selectedDateStr;
              const isTod = dStr === new Date().toISOString().split('T')[0];
              const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
              const dayNum = d.getDate();

              return (
                <button
                  key={dStr}
                  onClick={() => setSelectedDateStr(dStr)}
                  className={`p-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                    isSel
                      ? 'bg-sky-500 text-zinc-950 font-black shadow-md'
                      : isTod
                      ? 'bg-zinc-800 text-sky-400 border border-sky-400'
                      : 'bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold">{dayName.slice(0, 3)}</span>
                  <span className="text-sm font-extrabold">{dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View Content */}
      {viewMode === 'day' && (
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">{formattedSelectedHeader}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {dayAppointments.length} citas programadas
            </p>
          </div>

          <button
            onClick={toggleDayOff}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isSelectedDayOff
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>{isSelectedDayOff ? 'Quitar Día Libre' : 'Marcar Día Libre'}</span>
          </button>
        </div>
      )}

      {/* Selected Day Agenda List Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white tracking-tight">
            {formattedSelectedHeader}
          </h3>

          {isSelectedDayOff && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Día Libre
            </span>
          )}
        </div>

        {dayAppointments.length === 0 ? (
          <div className="bg-zinc-900/90 border border-zinc-800/80 border-dashed rounded-2xl p-6 text-center space-y-2">
            <p className="text-xs text-zinc-400 font-medium">
              No hay citas programadas para esta fecha.
            </p>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Cita</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayAppointments.map((app) => {
              const barColor = getServiceBarColor(app.serviceType);

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    if (app.clientId) {
                      setSelectedClientId(app.clientId);
                      setActiveTab('clients');
                    }
                  }}
                  className="bg-zinc-900/90 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 transition-all cursor-pointer group shadow-md"
                >
                  {/* Left Accent Bar */}
                  <div className={`w-1 h-10 rounded-full shrink-0 ${barColor}`} />

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="text-xs font-bold text-zinc-400">
                      {app.startTime} – {app.endTime}
                    </div>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                      {app.clientName}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium truncate">
                      {app.serviceName || app.serviceType}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black text-emerald-400">
                      {formatMoney(app.price)}
                    </span>

                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAppointment(app);
                        setIsAppointmentModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
                      title="Editar cita"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Deseas eliminar la cita de ${app.clientName}?`)) {
                          deleteAppointment(app.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                      title="Eliminar cita"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {app.status !== 'Completed' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateAppointmentStatus(app.id, 'Completed');
                        }}
                        className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 transition-all"
                        title="Completar cita"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        Completada
                      </span>
                    )}
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
