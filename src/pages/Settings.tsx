
import React, { useState } from 'react';
import { Settings, Bell, Shield, Database, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    apiUrl: 'http://localhost:8000',
    refreshInterval: 5,
    enableNotifications: true,
    enableAutoRefresh: true,
    darkMode: true,
    showAdvancedMetrics: false,
    maxAnomaliesDisplay: 100,
    riskThreshold: 0.7,
  });

  const handleSave = () => {
    // Simulação de salvamento das configurações
    localStorage.setItem('percepta-settings', JSON.stringify(settings));
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleReset = () => {
    setSettings({
      apiUrl: 'http://localhost:8000',
      refreshInterval: 5,
      enableNotifications: true,
      enableAutoRefresh: true,
      darkMode: true,
      showAdvancedMetrics: false,
      maxAnomaliesDisplay: 100,
      riskThreshold: 0.7,
    });
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas ao padrão.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize o comportamento e aparência do dashboard
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
            <Label htmlFor="refreshInterval">Intervalo de Atualização (minutos)</Label>
            <Input
              id="refreshInterval"
              type="number"
              min="1"
              max="60"
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
                Receber alertas quando novas anomalias forem detectadas
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
                Atualizar dados automaticamente no intervalo configurado
              </p>
            </div>
            <Switch
              checked={settings.enableAutoRefresh}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAutoRefresh: checked }))}
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
                Usar tema escuro no dashboard
              </p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Métricas Avançadas</Label>
              <p className="text-sm text-muted-foreground">
                Exibir gráficos e análises detalhadas
              </p>
            </div>
            <Switch
              checked={settings.showAdvancedMetrics}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showAdvancedMetrics: checked }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxDisplay">Máximo de Anomalias por Página</Label>
            <Input
              id="maxDisplay"
              type="number"
              min="10"
              max="500"
              value={settings.maxAnomaliesDisplay}
              onChange={(e) => setSettings(prev => ({ ...prev, maxAnomaliesDisplay: parseInt(e.target.value) }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança e Alertas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="riskThreshold">Limite de Risco para Alertas</Label>
            <Input
              id="riskThreshold"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={settings.riskThreshold}
              onChange={(e) => setSettings(prev => ({ ...prev, riskThreshold: parseFloat(e.target.value) }))}
            />
            <p className="text-sm text-muted-foreground">
              Anomalias com score acima deste valor serão destacadas como alto risco
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
