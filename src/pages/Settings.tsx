import React, { useState } from 'react';
import { Bell, Database, Palette, Save, Sparkles, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BackButton } from '@/components/ui/back-button';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    apiUrl: 'http://localhost:9090/api/v1',
    websocketUrl: 'ws://localhost:9090/ws',
    refreshInterval: 30,
    enableNotifications: true,
    enableAutoRefresh: true,
    darkMode: true,
    enableDemoModeFallback: true,
    enableRedisSnapshots: true,
    riskThreshold: 70,
  });

  const handleSave = () => {
    localStorage.setItem('percepta-settings', JSON.stringify(settings));
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleReset = () => {
    setSettings({
      apiUrl: 'http://localhost:9090/api/v1',
      websocketUrl: 'ws://localhost:9090/ws',
      refreshInterval: 30,
      enableNotifications: true,
      enableAutoRefresh: true,
      darkMode: true,
      enableDemoModeFallback: true,
      enableRedisSnapshots: true,
      riskThreshold: 70,
    });
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas ao padrão.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Configurações</h1>
          <p className="text-muted-foreground">
            Controle conectividade, atualização em tempo real e políticas do cockpit de risco
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline">
            Resetar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configuração da API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">URL da API Percepta</Label>
            <Input
              id="apiUrl"
              value={settings.apiUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, apiUrl: e.target.value }))}
              placeholder="http://localhost:8000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websocketUrl">URL do WebSocket</Label>
            <Input
              id="websocketUrl"
              value={settings.websocketUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, websocketUrl: e.target.value }))}
              placeholder="ws://localhost:8080/ws"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="refreshInterval">Intervalo de Polling (segundos)</Label>
            <Input
              id="refreshInterval"
              type="number"
              min="5"
              max="300"
              value={settings.refreshInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações Push</Label>
              <p className="text-sm text-muted-foreground">
                Receber alertas quando novos spikes de risco forem detectados
              </p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Atualização Automática</Label>
              <p className="text-sm text-muted-foreground">
                Atualizar snapshots automaticamente entre ciclos de websocket e polling
              </p>
            </div>
            <Switch
              checked={settings.enableAutoRefresh}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAutoRefresh: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Fallback Demo</Label>
              <p className="text-sm text-muted-foreground">
                Manter cockpit navegável quando as fontes externas estiverem indisponíveis
              </p>
            </div>
            <Switch
              checked={settings.enableDemoModeFallback}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableDemoModeFallback: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aparência e Exibição
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Usar tema terminal orientado a risco e tendências
              </p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Snapshots em Redis</Label>
              <p className="text-sm text-muted-foreground">
                Preparar pipeline temporal para histórico e playback de eventos
              </p>
            </div>
            <Switch
              checked={settings.enableRedisSnapshots}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRedisSnapshots: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Política de Score e Futuro de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="riskThreshold">Limite de Risco para Alertas</Label>
            <Input
              id="riskThreshold"
              type="number"
              min="0"
              max="100"
              step="1"
              value={settings.riskThreshold}
              onChange={(e) => setSettings(prev => ({ ...prev, riskThreshold: parseFloat(e.target.value) }))}
            />
            <p className="text-sm text-muted-foreground">
              Ativos com SRI acima deste valor serão destacados como risco prioritário
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/40 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">Preparação futura</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A arquitetura já foi orientada para anomaly detection, forecasting, correlação de eventos e contextual analysis, mas sem ativar modelos complexos neste ciclo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
