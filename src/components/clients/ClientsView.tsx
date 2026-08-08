import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Instagram,
  ChevronRight
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const {
    clients,
    appointments,
    transactions,
    setSelectedClientId,
    setIsClientModalOpen,
    formatMoney,
    t
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Calculate client stats (total spent & visits)
  const getClientStats = (clientId: string) => {
    const clientApps = appointments.filter((a) => a.clientId === clientId);
    const totalSpent = clientApps.reduce((sum, a) => sum + (a.price || 0), 0);
    const totalVisits = clientApps.length;
    return { totalSpent, totalVisits };
  };

  // Filter clients list for search bar
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.instagram && client.instagram.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800/80 p-4 rounded-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">{t('clientsTitle')}</h2>
            <p className="text-xs text-zinc-400">{clients.length} clientes registrados</p>
          </div>
        </div>

        <button
          onClick={() => setIsClientModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('btnAddClient')}</span>
        </button>
      </div>

      {/* ALL CLIENTS DIRECTORY */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
            <span>Directorio</span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold">
              {filteredClients.length}
            </span>
          </h3>

          {/* Search bar */}
          <div className="relative flex-1 max-w-[200px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchClients')}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Client List */}
        {filteredClients.length === 0 ? (
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-8 text-center space-y-2">
            <p className="text-xs text-zinc-400">No se encontraron clientes.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredClients.map((client) => {
              const { totalSpent, totalVisits } = getClientStats(client.id);

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className="bg-zinc-900/90 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-md group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-emerald-400 text-zinc-950 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-300 shadow-sm">
                      {client.avatarUrl ? (
                        <img
                          src={client.avatarUrl}
                          alt={client.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>
                          {client.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                        {client.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          {client.phone}
                        </span>
                        {client.instagram && (
                          <span className="hidden sm:flex items-center gap-1 text-purple-400 truncate">
                            <Instagram className="w-3 h-3" />
                            {client.instagram}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400">
                        {formatMoney(totalSpent)}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">
                        {totalVisits} visitas
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
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
