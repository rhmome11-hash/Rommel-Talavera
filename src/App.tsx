import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { TodayDashboard } from './components/today/TodayDashboard';
import { CalendarView } from './components/calendar/CalendarView';
import { ClientsView } from './components/clients/ClientsView';
import { FinanceView } from './components/finance/FinanceView';
import { SettingsView } from './components/settings/SettingsView';

import { ClientDetailModal } from './components/clients/ClientDetailModal';
import { AppointmentModal } from './components/modals/AppointmentModal';
import { ClientModal } from './components/modals/ClientModal';
import { TransactionModal } from './components/modals/TransactionModal';
import { VoucherModal } from './components/modals/VoucherModal';
import { InstagramStoryModal } from './components/modals/InstagramStoryModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500 selection:text-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'today' && <TodayDashboard />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'clients' && <ClientsView />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Global Modals & Notifications */}
      <OnboardingModal />
      <ClientDetailModal />
      <AppointmentModal />
      <ClientModal />
      <TransactionModal />
      <VoucherModal />
      <InstagramStoryModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
