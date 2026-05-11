import { Activity, Wifi, WifiOff } from 'lucide-react';

interface RealtimeStatusProps {
  status: 'connecting' | 'live' | 'polling' | 'offline';
  lastUpdated: string;
}

const tone = {
  connecting: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  live: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  polling: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  offline: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
};

export function RealtimeStatus({ status, lastUpdated }: RealtimeStatusProps) {
  const Icon = status === 'offline' ? WifiOff : status === 'live' ? Activity : Wifi;

  return (
    <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm ${tone[status]}`}>
      <Icon className={`h-4 w-4 ${status === 'live' ? 'animate-pulse' : ''}`} />
      <span className="font-medium capitalize">{status}</span>
      <span className="text-xs opacity-80">{new Date(lastUpdated).toLocaleTimeString('pt-BR')}</span>
    </div>
  );
}
