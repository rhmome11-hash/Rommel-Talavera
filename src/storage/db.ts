import {
  Client,
  Appointment,
  Transaction,
  RecurringExpense,
  GiftVoucher,
  StudioSettings
} from '../types';
import {
  INITIAL_CLIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_RECURRING,
  INITIAL_VOUCHERS,
  INITIAL_SETTINGS
} from '../data/initialData';

const KEYS = {
  CLIENTS: 'tattoostudio_clients_v2',
  APPOINTMENTS: 'tattoostudio_appointments_v2',
  TRANSACTIONS: 'tattoostudio_transactions_v2',
  RECURRING: 'tattoostudio_recurring_v2',
  VOUCHERS: 'tattoostudio_vouchers_v2',
  SETTINGS: 'tattoostudio_settings_v2',
};

// Clean up old v1 keys if present
try {
  localStorage.removeItem('tattoostudio_clients_v1');
  localStorage.removeItem('tattoostudio_appointments_v1');
  localStorage.removeItem('tattoostudio_transactions_v1');
  localStorage.removeItem('tattoostudio_recurring_v1');
  localStorage.removeItem('tattoostudio_vouchers_v1');
  localStorage.removeItem('tattoostudio_settings_v1');
} catch (e) {
  // Ignore storage errors in restricted contexts
}

const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage:`, err);
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to LocalStorage:`, err);
  }
};

export const DB = {
  getClients: (): Client[] => getItem(KEYS.CLIENTS, INITIAL_CLIENTS),
  saveClients: (clients: Client[]) => setItem(KEYS.CLIENTS, clients),

  getAppointments: (): Appointment[] => getItem(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS),
  saveAppointments: (appointments: Appointment[]) => setItem(KEYS.APPOINTMENTS, appointments),

  getTransactions: (): Transaction[] => getItem(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  saveTransactions: (transactions: Transaction[]) => setItem(KEYS.TRANSACTIONS, transactions),

  getRecurring: (): RecurringExpense[] => getItem(KEYS.RECURRING, INITIAL_RECURRING),
  saveRecurring: (recurring: RecurringExpense[]) => setItem(KEYS.RECURRING, recurring),

  getVouchers: (): GiftVoucher[] => getItem(KEYS.VOUCHERS, INITIAL_VOUCHERS),
  saveVouchers: (vouchers: GiftVoucher[]) => setItem(KEYS.VOUCHERS, vouchers),

  getSettings: (): StudioSettings => getItem(KEYS.SETTINGS, INITIAL_SETTINGS),
  saveSettings: (settings: StudioSettings) => setItem(KEYS.SETTINGS, settings),

  resetAll: () => {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(KEYS.RECURRING, JSON.stringify(INITIAL_RECURRING));
    localStorage.setItem(KEYS.VOUCHERS, JSON.stringify(INITIAL_VOUCHERS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  },

  exportBackup: () => {
    const backupData = {
      clients: getItem(KEYS.CLIENTS, INITIAL_CLIENTS),
      appointments: getItem(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS),
      transactions: getItem(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
      recurring: getItem(KEYS.RECURRING, INITIAL_RECURRING),
      vouchers: getItem(KEYS.VOUCHERS, INITIAL_VOUCHERS),
      settings: getItem(KEYS.SETTINGS, INITIAL_SETTINGS),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(backupData, null, 2);
  },

  importBackup: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.clients && data.appointments && data.transactions) {
        setItem(KEYS.CLIENTS, data.clients);
        setItem(KEYS.APPOINTMENTS, data.appointments);
        setItem(KEYS.TRANSACTIONS, data.transactions);
        if (data.recurring) setItem(KEYS.RECURRING, data.recurring);
        if (data.vouchers) setItem(KEYS.VOUCHERS, data.vouchers);
        if (data.settings) setItem(KEYS.SETTINGS, data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to import backup JSON:', err);
      return false;
    }
  }
};
