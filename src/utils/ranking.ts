import { Client, Appointment, Transaction, RankingMetric, RankingPeriod } from '../types';

export interface ClientRankData {
  client: Client;
  totalSpent: number;
  totalVisits: number;
  lastVisitDate: string | null;
  rank: number;
  completedVisitsCount: number;
}

export function computeClientRankings(
  clients: Client[],
  appointments: Appointment[],
  transactions: Transaction[],
  metric: RankingMetric = 'spent',
  period: RankingPeriod = 'all'
): ClientRankData[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const isDateInPeriod = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;

    if (period === 'all') return true;
    if (period === 'year') {
      return d.getFullYear() === currentYear;
    }
    if (period === 'month') {
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    }
    return true;
  };

  const rankList: ClientRankData[] = clients.map((client) => {
    // 1. Calculate money spent from transactions (Income for this client) and completed appointments
    const clientTransactions = transactions.filter(
      (t) => t.clientId === client.id && t.type === 'Income' && isDateInPeriod(t.date)
    );
    const transactionSpent = clientTransactions.reduce((acc, t) => acc + t.amount, 0);

    // Completed appointments price
    const clientCompletedApps = appointments.filter(
      (a) => a.clientId === client.id && a.status === 'Completed' && isDateInPeriod(a.date)
    );
    const appointmentSpent = clientCompletedApps.reduce((acc, a) => acc + a.price, 0);

    // Total spent uses max or combined logic; here we combine unique or take sum of completed apps/transactions
    // If appointment is matched to transaction, avoid double counting or use transaction sum if available, else appointments
    const totalSpent = transactionSpent > 0 ? transactionSpent : appointmentSpent;

    // 2. Calculate visits
    const allClientApps = appointments.filter(
      (a) => a.clientId === client.id && isDateInPeriod(a.date)
    );
    const completedApps = allClientApps.filter((a) => a.status === 'Completed');
    const totalVisits = allClientApps.length;
    const completedVisitsCount = completedApps.length;

    // 3. Find latest visit
    const sortedAppsByDate = [...allClientApps].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastVisitDate = sortedAppsByDate.length > 0 ? sortedAppsByDate[0].date : null;

    return {
      client,
      totalSpent,
      totalVisits,
      lastVisitDate,
      completedVisitsCount,
      rank: 0
    };
  });

  // Sort based on primary metric, then tie-breakers
  rankList.sort((a, b) => {
    if (metric === 'spent') {
      if (b.totalSpent !== a.totalSpent) return b.totalSpent - a.totalSpent;
      if (b.totalVisits !== a.totalVisits) return b.totalVisits - a.totalVisits;
    } else if (metric === 'visits') {
      if (b.totalVisits !== a.totalVisits) return b.totalVisits - a.totalVisits;
      if (b.totalSpent !== a.totalSpent) return b.totalSpent - a.totalSpent;
    } else if (metric === 'frequency') {
      // Latest visit date primary
      const dateA = a.lastVisitDate ? new Date(a.lastVisitDate).getTime() : 0;
      const dateB = b.lastVisitDate ? new Date(b.lastVisitDate).getTime() : 0;
      if (dateB !== dateA) return dateB - dateA;
      if (b.totalSpent !== a.totalSpent) return b.totalSpent - a.totalSpent;
    }

    // Default tie breaker: name
    return a.client.name.localeCompare(b.client.name);
  });

  // Assign ranks (1-based index)
  return rankList.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}
