export type ProfessionType = 'tattoo' | 'barber' | 'nails' | 'piercing' | 'general';

export type ServiceType = 
  | 'Tattoo' 
  | 'Touch-up' 
  | 'Piercing' 
  | 'Laser' 
  | 'Consultation' 
  | 'Corte' 
  | 'Barba' 
  | 'Manicura' 
  | 'Pedicura' 
  | 'Tratamiento' 
  | 'Other';

export type AppointmentStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

export type TransactionType = 'Income' | 'Expense';

export type PaymentMethod = 'Cash' | 'Card' | 'Bizum/Transfer' | 'Voucher' | 'Other';

export interface ServiceItem {
  id: string;
  name: string;
  type: ServiceType;
  basePrice: number;
  durationMinutes: number;
  color: string;
}

export interface ClientPhoto {
  id: string;
  url: string;
  title: string;
  category: ServiceType;
  date: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  instagram?: string;
  avatarUrl?: string;
  firstVisitDate: string;
  notes?: string;
  medicalNotes?: string; // Allergies, sensitivities, preferences
  photos: ClientPhoto[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceType: ServiceType;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  price: number;
  deposit: number;
  status: AppointmentStatus;
  notes?: string;
  artistName?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  concept: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string; // e.g., 'Ingreso Servicio', 'Alquiler', 'Materiales'
  paymentMethod: PaymentMethod;
  clientId?: string;
  appointmentId?: string;
}

export interface RecurringExpense {
  id: string;
  concept: string;
  amount: number;
  dueDay: number; // Day of month 1-31
  category: string;
  isActive: boolean;
  lastPaidDate?: string;
}

export interface GiftVoucher {
  id: string;
  code: string;
  clientName: string;
  buyerName: string;
  initialValue: number;
  currentBalance: number;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Redeemed' | 'Expired';
}

export interface StudioSettings {
  studioName: string;
  artistName: string;
  profession: ProfessionType;
  currencySymbol: string;
  language: 'es' | 'en';
  notificationsEnabled: boolean;
  reminderLeadHours: number;
  workingDays: number[]; // 0=Sun, 1=Mon...
  dayOffs: string[]; // ['YYYY-MM-DD']
  services: ServiceItem[];
  isOnboarded?: boolean;
}

export type RankingMetric = 'spent' | 'visits' | 'frequency';
export type RankingPeriod = 'month' | 'year' | 'all';

