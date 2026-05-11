import React from 'react';
import { Activity, Cpu, Database, Info, Layers3, Radio, Workflow } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/ui/back-button';

export default function About() {
  const features = [
    {
      icon: Layers3,
      title: 'Camada de Inteligência',
      description: 'O Percepta fica acima dos sistemas existentes e consolida risco sem substituir dashboards já adotados.'
    },
    {
      icon: Activity,
      title: 'Risco em Tempo Real',
      description: 'Score SRI, ticker, heatmap e timeline tornam tendência e aceleração visíveis imediatamente.'
    },
    {
      icon: Workflow,
      title: 'Arquitetura Plugável',
      description: 'Connectors, normalizers e storage desacoplados permitem integrar novas fontes sem contaminar o core.'
    }
  ];

  const technologies = [
    'Go + Fiber para API e websocket',
    'PostgreSQL como store relacional e read replicas',
    'Redis Streams para snapshots e realtime fan-out',
    'React + TypeScript + Tailwind + Recharts no cockpit',
    'OpenTelemetry para observabilidade enterprise',
    'NATS ou Kafka apenas se volume/eventos crescerem muito'
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <BackButton />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto shadow-[0_20px_60px_-30px_rgba(13,211,255,0.8)]">
          <Layers3 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gradient">Percepta Security Intelligence Layer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Plataforma modular para normalizar dados de segurança, calcular risco em tempo real e entregar insights prontos para embed
        </p>
        <Badge variant="outline" className="text-sm">
          Versão 2.0.0 foundation
        </Badge>
      </div>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sobre o Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            O Percepta v2 foi redesenhado para atuar como camada de inteligência acima de GitLab SaaS,
            dashboards internos, bancos PostgreSQL, APIs externas e ferramentas AppSec. Em vez de depender
            do schema original de cada fonte, ele converte tudo para modelos internos padronizados.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A direção arquitetural prioriza conectores plugáveis, normalização explícita, cálculo de risco
            em tempo real, histórico temporal, websocket e preparação para agentes de IA sem ativar ainda
            um stack pesado de inteligência artificial.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Principais Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5" />Tecnologias Recomendadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {technologies.map((tech, index) => (
              <div key={index} className="rounded-2xl border border-border/70 bg-card/40 p-4 text-sm text-muted-foreground">
                {tech}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Integrações-alvo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['GitLab SaaS', 'Security Dashboards internos', 'PostgreSQL/read replica', 'APIs externas', 'Snyk/AppSec', 'Sistemas host com aba Percepta Insights'].map((item) => (
              <Badge key={item} variant="outline" className="border-border/70 px-3 py-1 text-sm">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Radio className="h-5 w-5" />Direção de plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="rounded-2xl border border-border/70 bg-card/40 p-4">Vite continua adequado para este estágio porque entrega SPA rápida, embed simples e baixo custo de evolução. Se SSR, auth federada complexa ou distribuição por múltiplos tenants virarem prioridade, Next.js passa a ser uma migração defensável.</p>
            <p className="rounded-2xl border border-border/70 bg-card/40 p-4">Para enterprise observability, vale adicionar OpenTelemetry, feature flags e tracing por connector antes de introduzir IA mais sofisticada.</p>
            <p className="rounded-2xl border border-border/70 bg-card/40 p-4">Para conectores com alta cardinalidade ou ingestão quase contínua, um barramento como NATS JetStream tende a ser mais simples que Kafka no início, mantendo caminho de crescimento claro.</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>© 2026 Percepta. Security Intelligence Layer para crescimento modular e embedding enterprise.</p>
      </div>
    </div>
  );
}
