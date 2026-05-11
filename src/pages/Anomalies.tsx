import Dashboard from './Dashboard';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Anomalies() {
  return (
    <div className="space-y-6 p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Overview
      </Link>
      <Dashboard initialTab="findings" />
    </div>
  );
}
