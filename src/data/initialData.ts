import { Client, Appointment, Transaction, RecurringExpense, GiftVoucher, StudioSettings, ProfessionType, ServiceItem } from '../types';

export const getDefaultServicesForProfession = (profession: ProfessionType): ServiceItem[] => {
  switch (profession) {
    case 'barber':
      return [
        { id: 'srv-b1', name: 'Corte de Cabello Estilo/Fade', type: 'Corte', basePrice: 18, durationMinutes: 30, color: '#38BDF8' },
        { id: 'srv-b2', name: 'Arreglo & Perfilado de Barba', type: 'Barba', basePrice: 12, durationMinutes: 20, color: '#F59E0B' },
        { id: 'srv-b3', name: 'Combo Corte + Barba VIP', type: 'Corte', basePrice: 26, durationMinutes: 45, color: '#A855F7' },
        { id: 'srv-b4', name: 'Afeitado Clásico a Navaja', type: 'Barba', basePrice: 20, durationMinutes: 30, color: '#EF4444' },
        { id: 'srv-b5', name: 'Tinte / Coloración Barba o Cabello', type: 'Tratamiento', basePrice: 22, durationMinutes: 40, color: '#10B981' },
        { id: 'srv-b6', name: 'Tratamiento Capilar / Lavado', type: 'Tratamiento', basePrice: 15, durationMinutes: 20, color: '#6366F1' }
      ];

    case 'nails':
      return [
        { id: 'srv-n1', name: 'Manicura Semipermanente', type: 'Manicura', basePrice: 25, durationMinutes: 45, color: '#EC4899' },
        { id: 'srv-n2', name: 'Uñas Acrílicas / Gel (Set Nuevo)', type: 'Manicura', basePrice: 45, durationMinutes: 90, color: '#A855F7' },
        { id: 'srv-n3', name: 'Relleno de Acrílico / Gel', type: 'Manicura', basePrice: 32, durationMinutes: 60, color: '#C084FC' },
        { id: 'srv-n4', name: 'Pedicura Completa / Spa', type: 'Pedicura', basePrice: 35, durationMinutes: 60, color: '#10B981' },
        { id: 'srv-n5', name: 'Nail Art / Diseños Especiales', type: 'Manicura', basePrice: 15, durationMinutes: 20, color: '#F59E0B' },
        { id: 'srv-n6', name: 'Retiro de Sistema / Uñas', type: 'Tratamiento', basePrice: 12, durationMinutes: 25, color: '#9CA3AF' }
      ];

    case 'piercing':
      return [
        { id: 'srv-p1', name: 'Piercing Oreja / Lóbulo / Hélix', type: 'Piercing', basePrice: 30, durationMinutes: 25, color: '#10B981' },
        { id: 'srv-p2', name: 'Piercing Nariz / Nostril / Septum', type: 'Piercing', basePrice: 35, durationMinutes: 30, color: '#38BDF8' },
        { id: 'srv-p3', name: 'Piercing Corporal / Industrial', type: 'Piercing', basePrice: 45, durationMinutes: 40, color: '#A855F7' },
        { id: 'srv-p4', name: 'Microdermal / Implante', type: 'Piercing', basePrice: 55, durationMinutes: 45, color: '#F59E0B' },
        { id: 'srv-p5', name: 'Cambio de Joya / Cura', type: 'Consultation', basePrice: 15, durationMinutes: 20, color: '#9CA3AF' }
      ];

    case 'general':
      return [
        { id: 'srv-g1', name: 'Servicio Estándar', type: 'Consultation', basePrice: 35, durationMinutes: 45, color: '#38BDF8' },
        { id: 'srv-g2', name: 'Servicio Especializado / Completo', type: 'Consultation', basePrice: 70, durationMinutes: 90, color: '#A855F7' },
        { id: 'srv-g3', name: 'Consulta / Evaluación', type: 'Consultation', basePrice: 0, durationMinutes: 30, color: '#9CA3AF' }
      ];

    case 'tattoo':
    default:
      return [
        { id: 'srv-1', name: 'Tatuaje Personalizado (Pieza Grande)', type: 'Tattoo', basePrice: 250, durationMinutes: 180, color: '#A855F7' },
        { id: 'srv-2', name: 'Tatuaje Fine Line / Minimalista', type: 'Tattoo', basePrice: 90, durationMinutes: 60, color: '#C084FC' },
        { id: 'srv-3', name: 'Repaso / Touch-up', type: 'Touch-up', basePrice: 40, durationMinutes: 45, color: '#38BDF8' },
        { id: 'srv-4', name: 'Piercing Oreja / Nariz / Labio', type: 'Piercing', basePrice: 35, durationMinutes: 30, color: '#10B981' },
        { id: 'srv-5', name: 'Eliminación Láser (Sesión)', type: 'Laser', basePrice: 80, durationMinutes: 45, color: '#F59E0B' },
        { id: 'srv-6', name: 'Consulta / Diseño previo', type: 'Consultation', basePrice: 0, durationMinutes: 30, color: '#9CA3AF' }
      ];
  }
};

export const INITIAL_SETTINGS: StudioSettings = {
  studioName: '',
  artistName: '',
  profession: 'tattoo',
  currencySymbol: '€',
  language: 'es',
  notificationsEnabled: true,
  reminderLeadHours: 24,
  workingDays: [1, 2, 3, 4, 5, 6], // Mon - Sat
  dayOffs: [],
  services: getDefaultServicesForProfession('tattoo'),
  isOnboarded: false
};

export const INITIAL_CLIENTS: Client[] = [];
export const INITIAL_APPOINTMENTS: Appointment[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_RECURRING: RecurringExpense[] = [];
export const INITIAL_VOUCHERS: GiftVoucher[] = [];

