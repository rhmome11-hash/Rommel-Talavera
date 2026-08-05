import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Appointment,
  Transaction,
  RecurringExpense,
  GiftVoucher,
  StudioSettings,
  ClientPhoto
} from '../types';
import { DB } from '../storage/db';
import { translations } from '../utils/translations';

export type TabType = 'today' | 'calendar' | 'clients' | 'finance' | 'settings';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  clients: Client[];
  appointments: Appointment[];
  transactions: Transaction[];
  recurring: RecurringExpense[];
  vouchers: GiftVoucher[];
  settings: StudioSettings;
  
  // Modals & Active Selections
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  editingAppointment: Appointment | null;
  setEditingAppointment: (app: Appointment | null) => void;

  isClientModalOpen: boolean;
  setIsClientModalOpen: (open: boolean) => void;
  editingClient: Client | null;
  setEditingClient: (client: Client | null) => void;

  isTransactionModalOpen: boolean;
  setIsTransactionModalOpen: (open: boolean) => void;

  isVoucherModalOpen: boolean;
  setIsVoucherModalOpen: (open: boolean) => void;

  isStoryModalOpen: boolean;
  setIsStoryModalOpen: (open: boolean) => void;

  // CRUD Actions
  addClient: (clientData: Omit<Client, 'id' | 'photos'>) => Client;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addClientPhoto: (clientId: string, photo: Omit<ClientPhoto, 'id'>) => void;
  deleteClientPhoto: (clientId: string, photoId: string) => void;

  addAppointment: (appData: Omit<Appointment, 'id'>) => void;
  updateAppointment: (app: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteAppointment: (id: string) => void;

  addTransaction: (txData: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  toggleRecurringPaid: (id: string) => void;
  addRecurringExpense: (expense: Omit<RecurringExpense, 'id'>) => void;

  addVoucher: (voucherData: Omit<GiftVoucher, 'id' | 'status'>) => void;
  redeemVoucher: (id: string, amount: number) => void;

  updateSettings: (newSettings: Partial<StudioSettings>) => void;
  resetAllData: () => void;
  importJSON: (jsonStr: string) => boolean;

  // Helpers
  t: (key: keyof typeof translations.es, replacements?: Record<string, string | number>) => string;
  formatMoney: (amount: number) => string;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  toasts: ToastMessage[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [settings, setSettings] = useState<StudioSettings>(DB.getSettings());

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initial load
  useEffect(() => {
    setClients(DB.getClients());
    setAppointments(DB.getAppointments());
    setTransactions(DB.getTransactions());
    setRecurring(DB.getRecurring());
    setVouchers(DB.getVouchers());
    setSettings(DB.getSettings());
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Translation helper
  const t = (key: keyof typeof translations.es, replacements?: Record<string, string | number>): string => {
    const lang = settings.language || 'es';
    const dict = translations[lang] || translations.es;
    let val = dict[key] || translations.es[key] || String(key);
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        val = val.replace(`{{${k}}}`, String(v));
      });
    }
    return val;
  };

  // Money Formatter
  const formatMoney = (amount: number): string => {
    const sym = settings.currencySymbol || '€';
    return `${amount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${sym}`;
  };

  // CLIENT CRUD
  const addClient = (clientData: Omit<Client, 'id' | 'photos'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      photos: []
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    DB.saveClients(updated);
    showToast(`Cliente ${newClient.name} creado con éxito`);
    return newClient;
  };

  const updateClient = (client: Client) => {
    const updated = clients.map((c) => (c.id === client.id ? client : c));
    setClients(updated);
    DB.saveClients(updated);
    showToast(`Cliente ${client.name} actualizado`);
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    DB.saveClients(updated);
    if (selectedClientId === id) setSelectedClientId(null);
    showToast('Cliente eliminado', 'info');
  };

  const addClientPhoto = (clientId: string, photoData: Omit<ClientPhoto, 'id'>) => {
    const newPhoto: ClientPhoto = {
      ...photoData,
      id: `photo-${Date.now()}`
    };
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          photos: [newPhoto, ...c.photos]
        };
      }
      return c;
    });
    setClients(updated);
    DB.saveClients(updated);
    showToast('Foto de trabajo añadida al cliente');
  };

  const deleteClientPhoto = (clientId: string, photoId: string) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          photos: c.photos.filter((p) => p.id !== photoId)
        };
      }
      return c;
    });
    setClients(updated);
    DB.saveClients(updated);
    showToast('Foto eliminada');
  };

  // APPOINTMENT CRUD
  const addAppointment = (appData: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = {
      ...appData,
      id: `app-${Date.now()}`
    };
    const updated = [newApp, ...appointments];
    setAppointments(updated);
    DB.saveAppointments(updated);

    // If appointment is completed or deposit paid, optionally log income transaction
    if (newApp.deposit > 0) {
      addTransaction({
        type: 'Income',
        concept: `Fianza Cita: ${newApp.serviceName} (${newApp.clientName})`,
        amount: newApp.deposit,
        date: newApp.date,
        category: 'Fianzas Citas',
        paymentMethod: 'Card',
        clientId: newApp.clientId,
        appointmentId: newApp.id
      });
    }

    showToast(`Cita programada para ${newApp.clientName}`);
  };

  const updateAppointment = (app: Appointment) => {
    const updated = appointments.map((a) => (a.id === app.id ? app : a));
    setAppointments(updated);
    DB.saveAppointments(updated);
    showToast('Cita actualizada');
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const app = appointments.find((a) => a.id === id);
    if (!app) return;

    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    setAppointments(updated);
    DB.saveAppointments(updated);

    // If marked Completed and price remaining > 0, log income transaction
    if (status === 'Completed' && app.price > 0) {
      const remainingAmount = Math.max(0, app.price - app.deposit);
      if (remainingAmount > 0) {
        addTransaction({
          type: 'Income',
          concept: `Cobro Sesión: ${app.serviceName} (${app.clientName})`,
          amount: remainingAmount,
          date: app.date,
          category: `${app.serviceType} Income`,
          paymentMethod: 'Card',
          clientId: app.clientId,
          appointmentId: app.id
        });
      }
    }

    showToast(`Estado de cita actualizado a ${status}`);
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    DB.saveAppointments(updated);
    showToast('Cita eliminada', 'info');
  };

  // TRANSACTION CRUD
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    DB.saveTransactions(updated);
    showToast(`${newTx.type === 'Income' ? 'Ingreso' : 'Gasto'} registrado`);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    DB.saveTransactions(updated);
    showToast('Transacción eliminada', 'info');
  };

  // RECURRING EXPENSES
  const toggleRecurringPaid = (id: string) => {
    const item = recurring.find((r) => r.id === id);
    if (!item) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const updated = recurring.map((r) => (r.id === id ? { ...r, lastPaidDate: todayStr } : r));
    setRecurring(updated);
    DB.saveRecurring(updated);

    // Add transaction expense record
    addTransaction({
      type: 'Expense',
      concept: `Gasto Recurrente: ${item.concept}`,
      amount: item.amount,
      date: todayStr,
      category: item.category,
      paymentMethod: 'Bizum/Transfer'
    });

    showToast(`Pago marcado como realizado: ${item.concept}`);
  };

  const addRecurringExpense = (expense: Omit<RecurringExpense, 'id'>) => {
    const newRec: RecurringExpense = {
      ...expense,
      id: `rec-${Date.now()}`
    };
    const updated = [...recurring, newRec];
    setRecurring(updated);
    DB.saveRecurring(updated);
    showToast('Gasto recurrente añadido');
  };

  // GIFT VOUCHERS
  const addVoucher = (voucherData: Omit<GiftVoucher, 'id' | 'status'>) => {
    const newVoucher: GiftVoucher = {
      ...voucherData,
      id: `vouch-${Date.now()}`,
      status: 'Active'
    };
    const updated = [newVoucher, ...vouchers];
    setVouchers(updated);
    DB.saveVouchers(updated);

    // Income transaction for voucher sale
    addTransaction({
      type: 'Income',
      concept: `Venta Gift Voucher (${newVoucher.code})`,
      amount: newVoucher.initialValue,
      date: newVoucher.issueDate,
      category: 'Gift Voucher',
      paymentMethod: 'Card'
    });

    showToast(`Bono ${newVoucher.code} emitido`);
  };

  const redeemVoucher = (id: string, amount: number) => {
    const updated = vouchers.map((v) => {
      if (v.id === id) {
        const newBalance = Math.max(0, v.currentBalance - amount);
        return {
          ...v,
          currentBalance: newBalance,
          status: (newBalance === 0 ? 'Redeemed' : 'Active') as GiftVoucher['status']
        };
      }
      return v;
    });
    setVouchers(updated);
    DB.saveVouchers(updated);
    showToast(`Bono canjeado por ${formatMoney(amount)}`);
  };

  // SETTINGS & BACKUP
  const updateSettings = (newSettings: Partial<StudioSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    DB.saveSettings(updated);
    showToast('Ajustes del estudio guardados');
  };

  const resetAllData = () => {
    DB.resetAll();
    setClients(DB.getClients());
    setAppointments(DB.getAppointments());
    setTransactions(DB.getTransactions());
    setRecurring(DB.getRecurring());
    setVouchers(DB.getVouchers());
    setSettings(DB.getSettings());
    showToast('Datos reestablecidos a valores por defecto', 'info');
  };

  const importJSON = (jsonStr: string): boolean => {
    const success = DB.importBackup(jsonStr);
    if (success) {
      setClients(DB.getClients());
      setAppointments(DB.getAppointments());
      setTransactions(DB.getTransactions());
      setRecurring(DB.getRecurring());
      setVouchers(DB.getVouchers());
      setSettings(DB.getSettings());
      showToast('Copia de seguridad importada con éxito');
      return true;
    } else {
      showToast('Error al importar archivo JSON', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        clients,
        appointments,
        transactions,
        recurring,
        vouchers,
        settings,
        selectedClientId,
        setSelectedClientId,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        editingAppointment,
        setEditingAppointment,
        isClientModalOpen,
        setIsClientModalOpen,
        editingClient,
        setEditingClient,
        isTransactionModalOpen,
        setIsTransactionModalOpen,
        isVoucherModalOpen,
        setIsVoucherModalOpen,
        isStoryModalOpen,
        setIsStoryModalOpen,
        addClient,
        updateClient,
        deleteClient,
        addClientPhoto,
        deleteClientPhoto,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        addTransaction,
        deleteTransaction,
        toggleRecurringPaid,
        addRecurringExpense,
        addVoucher,
        redeemVoucher,
        updateSettings,
        resetAllData,
        importJSON,
        t,
        formatMoney,
        showToast,
        toasts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
