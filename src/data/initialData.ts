import { Client, Appointment, Transaction, RecurringExpense, GiftVoucher, StudioSettings } from '../types';

// Utility to get dates relative to today
const getFormattedDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SETTINGS: StudioSettings = {
  studioName: 'TattooStudio Pro Ink & Laser',
  artistName: 'Alex "Viper" Ramos',
  currencySymbol: '€',
  language: 'es',
  notificationsEnabled: true,
  reminderLeadHours: 24,
  workingDays: [1, 2, 3, 4, 5, 6], // Mon - Sat
  dayOffs: [getFormattedDate(7), getFormattedDate(14)],
  services: [
    { id: 'srv-1', name: 'Tatuaje Personalizado (Pieza Grande)', type: 'Tattoo', basePrice: 250, durationMinutes: 180, color: '#A855F7' },
    { id: 'srv-2', name: 'Tatuaje Fine Line / Minimalista', type: 'Tattoo', basePrice: 90, durationMinutes: 60, color: '#C084FC' },
    { id: 'srv-3', name: 'Repaso / Touch-up', type: 'Touch-up', basePrice: 40, durationMinutes: 45, color: '#38BDF8' },
    { id: 'srv-4', name: 'Piercing Oreja / Nariz / Labio', type: 'Piercing', basePrice: 35, durationMinutes: 30, color: '#10B981' },
    { id: 'srv-5', name: 'Piercing Industrial / Microdermal', type: 'Piercing', basePrice: 50, durationMinutes: 45, color: '#34D399' },
    { id: 'srv-6', name: 'Eliminación Láser Tatuaje (Sesión)', type: 'Laser', basePrice: 80, durationMinutes: 45, color: '#F59E0B' },
    { id: 'srv-7', name: 'Consulta / Diseño previo', type: 'Consultation', basePrice: 0, durationMinutes: 30, color: '#9CA3AF' }
  ]
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Carlos Mendoza',
    phone: '+34 612 345 678',
    email: 'carlos.mendoza@email.com',
    instagram: '@carlos.ink',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    firstVisitDate: '2025-02-10',
    notes: 'Cliente habitual. Le apasiona el estilo Neotradicional y Blackwork. Muy puntual.',
    medicalNotes: 'Alergia leve al látex (usar guantes de nitrilo).',
    photos: [
      {
        id: 'p-1',
        url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=500&auto=format&fit=crop&q=80',
        title: 'Manga Completa Blackwork - Antebrazo',
        category: 'Tattoo',
        date: getFormattedDate(-15),
        notes: 'Sesión de 4h. Curación excelente con film protector.'
      },
      {
        id: 'p-2',
        url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=500&auto=format&fit=crop&q=80',
        title: 'Cráneo Neotradicional Pecho',
        category: 'Tattoo',
        date: getFormattedDate(-90),
        notes: 'Líneas sólidas y sombras oscuras.'
      }
    ]
  },
  {
    id: 'cli-2',
    name: 'Sofia Valenzuela',
    phone: '+34 654 987 321',
    email: 'sofia.v@email.com',
    instagram: '@sofi_tattoo_art',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    firstVisitDate: '2025-05-18',
    notes: 'Fan de piercings y pequeños tatuajes fine-line.',
    medicalNotes: 'Piel sensible, aplicar bálsamo calmante extra.',
    photos: [
      {
        id: 'p-3',
        url: 'https://images.unsplash.com/photo-1542382257-80dedb725088?w=500&auto=format&fit=crop&q=80',
        title: 'Piercing Septum Titanio Dorado',
        category: 'Piercing',
        date: getFormattedDate(-10),
        notes: 'Titanio grado implante 1.2mm.'
      }
    ]
  },
  {
    id: 'cli-3',
    name: 'Mateo Rossi',
    phone: '+34 688 112 233',
    email: 'm.rossi@email.com',
    instagram: '@m.rossi_official',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    firstVisitDate: '2025-01-05',
    notes: 'Tratamiento de eliminación de tatuaje en muñeca previa a cover-up.',
    medicalNotes: 'Ninguna alergia conocida.',
    photos: [
      {
        id: 'p-4',
        url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=500&auto=format&fit=crop&q=80',
        title: 'Sesión #3 Eliminación Láser Muñeca',
        category: 'Laser',
        date: getFormattedDate(-30),
        notes: 'Pigmento reducido un 60%.'
      }
    ]
  },
  {
    id: 'cli-4',
    name: 'Elena Gómez',
    phone: '+34 677 443 322',
    email: 'elena.gomez@email.com',
    instagram: '@elena_gmz',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    firstVisitDate: '2025-03-22',
    notes: 'Colecciona tatuajes botánicos en acuarela y microdermal.',
    medicalNotes: 'Ninguna.',
    photos: []
  },
  {
    id: 'cli-5',
    name: 'David Sanabria',
    phone: '+34 633 998 877',
    email: 'david.s@email.com',
    instagram: '@david_s_ink',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    firstVisitDate: '2025-04-12',
    notes: 'Cliente de piezas grandes en espalda.',
    medicalNotes: 'Sin incidencias.',
    photos: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Today's appointments
  {
    id: 'app-today-1',
    clientId: 'cli-1',
    clientName: 'Carlos Mendoza',
    serviceType: 'Tattoo',
    serviceName: 'Manga Blackwork (Sesión 2)',
    date: getFormattedDate(0),
    startTime: '10:30',
    endTime: '13:30',
    price: 280,
    deposit: 50,
    status: 'In Progress',
    notes: 'Terminar sombreado en codo y antebrazo interior.',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-today-2',
    clientId: 'cli-2',
    clientName: 'Sofia Valenzuela',
    serviceType: 'Piercing',
    serviceName: 'Piercing Helix + Nostril Titanio',
    date: getFormattedDate(0),
    startTime: '15:00',
    endTime: '15:45',
    price: 65,
    deposit: 15,
    status: 'Scheduled',
    notes: 'Aros de titanio hipoalergénico.',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-today-3',
    clientId: 'cli-3',
    clientName: 'Mateo Rossi',
    serviceType: 'Laser',
    serviceName: 'Sesión #4 Láser ND-YAG',
    date: getFormattedDate(0),
    startTime: '17:00',
    endTime: '17:45',
    price: 80,
    deposit: 20,
    status: 'Scheduled',
    notes: 'Tratamiento despigmentación rápida.',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-today-4',
    clientId: 'cli-4',
    clientName: 'Elena Gómez',
    serviceType: 'Consultation',
    serviceName: 'Diseño Personalizado Espalda',
    date: getFormattedDate(0),
    startTime: '18:30',
    endTime: '19:00',
    price: 0,
    deposit: 0,
    status: 'Scheduled',
    notes: 'Revisión de boceto y tallas.',
    artistName: 'Alex "Viper" Ramos'
  },

  // Tomorrow & future
  {
    id: 'app-fut-1',
    clientId: 'cli-5',
    clientName: 'David Sanabria',
    serviceType: 'Tattoo',
    serviceName: 'Pieza Realista Tigre Espalda',
    date: getFormattedDate(1),
    startTime: '11:00',
    endTime: '15:00',
    price: 350,
    deposit: 100,
    status: 'Scheduled',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-fut-2',
    clientId: 'cli-1',
    clientName: 'Carlos Mendoza',
    serviceType: 'Touch-up',
    serviceName: 'Repaso Detalle Muñeca',
    date: getFormattedDate(3),
    startTime: '16:00',
    endTime: '16:45',
    price: 40,
    deposit: 0,
    status: 'Scheduled',
    artistName: 'Alex "Viper" Ramos'
  },

  // Past appointments for ranking & history
  {
    id: 'app-past-1',
    clientId: 'cli-1',
    clientName: 'Carlos Mendoza',
    serviceType: 'Tattoo',
    serviceName: 'Manga Blackwork Sesión 1',
    date: getFormattedDate(-15),
    startTime: '10:00',
    endTime: '14:00',
    price: 320,
    deposit: 50,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-past-2',
    clientId: 'cli-1',
    clientName: 'Carlos Mendoza',
    serviceType: 'Tattoo',
    serviceName: 'Cráneo Neotradicional Pecho',
    date: getFormattedDate(-90),
    startTime: '11:00',
    endTime: '15:30',
    price: 450,
    deposit: 100,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-past-3',
    clientId: 'cli-2',
    clientName: 'Sofia Valenzuela',
    serviceType: 'Piercing',
    serviceName: 'Piercing Septum Titanio',
    date: getFormattedDate(-10),
    startTime: '16:00',
    endTime: '16:30',
    price: 45,
    deposit: 0,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-past-4',
    clientId: 'cli-2',
    clientName: 'Sofia Valenzuela',
    serviceType: 'Tattoo',
    serviceName: 'Fine Line Flores Clavícula',
    date: getFormattedDate(-40),
    startTime: '12:00',
    endTime: '13:15',
    price: 120,
    deposit: 30,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-past-5',
    clientId: 'cli-3',
    clientName: 'Mateo Rossi',
    serviceType: 'Laser',
    serviceName: 'Sesión #3 Láser ND-YAG',
    date: getFormattedDate(-30),
    startTime: '17:00',
    endTime: '17:45',
    price: 80,
    deposit: 0,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-past-6',
    clientId: 'cli-3',
    clientName: 'Mateo Rossi',
    serviceType: 'Laser',
    serviceName: 'Sesión #2 Láser ND-YAG',
    date: getFormattedDate(-60),
    startTime: '17:00',
    endTime: '17:45',
    price: 80,
    deposit: 0,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-past-7',
    clientId: 'cli-3',
    clientName: 'Mateo Rossi',
    serviceType: 'Laser',
    serviceName: 'Sesión #1 Láser ND-YAG',
    date: getFormattedDate(-90),
    startTime: '17:00',
    endTime: '17:45',
    price: 80,
    deposit: 0,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  },
  {
    id: 'app-past-8',
    clientId: 'cli-5',
    clientName: 'David Sanabria',
    serviceType: 'Tattoo',
    serviceName: 'Cobra Japonesa Muslo',
    date: getFormattedDate(-20),
    startTime: '10:00',
    endTime: '15:00',
    price: 500,
    deposit: 100,
    status: 'Completed',
    artistName: 'Alex "Viper" Ramos'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'Income',
    concept: 'Cobro Tatuaje Manga Carlos Mendoza',
    amount: 320,
    date: getFormattedDate(-15),
    category: 'Tattoo Income',
    paymentMethod: 'Card',
    clientId: 'cli-1'
  },
  {
    id: 'tx-2',
    type: 'Income',
    concept: 'Cobro Cobra Japonesa David Sanabria',
    amount: 500,
    date: getFormattedDate(-20),
    category: 'Tattoo Income',
    paymentMethod: 'Bizum/Transfer',
    clientId: 'cli-5'
  },
  {
    id: 'tx-3',
    type: 'Expense',
    concept: 'Compra Agujas Kwadron & Tintas Dynamic Black',
    amount: 185,
    date: getFormattedDate(-12),
    category: 'Insumos y Materiales',
    paymentMethod: 'Card'
  },
  {
    id: 'tx-4',
    type: 'Expense',
    concept: 'Alquiler Local Estudio Agosto',
    amount: 750,
    date: getFormattedDate(-5),
    category: 'Alquiler Estudio',
    paymentMethod: 'Bizum/Transfer'
  },
  {
    id: 'tx-5',
    type: 'Income',
    concept: 'Piercing Septum Sofia Valenzuela',
    amount: 45,
    date: getFormattedDate(-10),
    category: 'Piercing Income',
    paymentMethod: 'Cash',
    clientId: 'cli-2'
  },
  {
    id: 'tx-6',
    type: 'Income',
    concept: 'Venta Gift Voucher Tatuaje 150€',
    amount: 150,
    date: getFormattedDate(-8),
    category: 'Gift Voucher',
    paymentMethod: 'Card'
  },
  {
    id: 'tx-7',
    type: 'Expense',
    concept: 'Mantenimiento Cabezal Láser Q-Switched',
    amount: 120,
    date: getFormattedDate(-25),
    category: 'Mantenimiento Láser',
    paymentMethod: 'Card'
  }
];

export const INITIAL_RECURRING: RecurringExpense[] = [
  {
    id: 'rec-1',
    concept: 'Alquiler Local & Licencia',
    amount: 750,
    dueDay: 5,
    category: 'Alquiler',
    isActive: true,
    lastPaidDate: getFormattedDate(-5)
  },
  {
    id: 'rec-2',
    concept: 'Suministro Eléctrico & Clima',
    amount: 120,
    dueDay: 15,
    category: 'Servicios Básicos',
    isActive: true,
    lastPaidDate: getFormattedDate(-20)
  },
  {
    id: 'rec-3',
    concept: 'Seguro de Responsabilidad Civil',
    amount: 65,
    dueDay: 1,
    category: 'Seguros',
    isActive: true,
    lastPaidDate: getFormattedDate(-35)
  },
  {
    id: 'rec-4',
    concept: 'Recogida Residuos Sanitarios Biosanitarios',
    amount: 45,
    dueDay: 28,
    category: 'Higiene y Normativa',
    isActive: true
  }
];

export const INITIAL_VOUCHERS: GiftVoucher[] = [
  {
    id: 'vouch-1',
    code: 'TATTOO-GIFT-8821',
    clientName: 'Elena Gómez',
    buyerName: 'Marcos Gómez (Hermano)',
    initialValue: 150,
    currentBalance: 150,
    issueDate: getFormattedDate(-8),
    expiryDate: getFormattedDate(180),
    status: 'Active'
  },
  {
    id: 'vouch-2',
    code: 'PIERCING-PRO-4410',
    clientName: 'Sofia Valenzuela',
    buyerName: 'Autoregalo',
    initialValue: 60,
    currentBalance: 15,
    issueDate: getFormattedDate(-40),
    expiryDate: getFormattedDate(120),
    status: 'Active'
  }
];
