import React from 'react';
import { Info, Shield, BarChart3, Users, Github, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/ui/back-button';

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'Detecção de Anomalias',
      description: 'Sistema avançado de machine learning para identificar comportamentos suspeitos em tempo real.'
    },
    {
      icon: BarChart3,
      title: 'Análises Detalhadas',
      description: 'Gráficos e métricas abrangentes para entender padrões e tendências de segurança.'
    },
    {
      icon: Users,
      title: 'Interface Intuitiva',
      description: 'Dashboard moderno e responsivo projetado para profissionais de segurança.'
    }
  ];

  const technologies = [
    'React 18', 'TypeScript', 'Tailwind CSS', 'Shadcn/ui', 
    'Recharts', 'React Query', 'Lucide Icons', 'Vite'
  ];

  const team = [
    { name: 'Equipe Percepta', role: 'Desenvolvimento e Pesquisa', avatar: 'P' },
    { name: 'AI Assistant', role: 'Assistente de Desenvolvimento', avatar: 'AI' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <BackButton />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gradient">Percepta Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema avançado de detecção e visualização de anomalias para segurança digital
        </p>
        <Badge variant="outline" className="text-sm">
          Versão 1.0.0
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
            O Percepta Dashboard é uma aplicação web moderna desenvolvida para visualizar e analisar 
            anomalias detectadas por sistemas de segurança. Utilizando tecnologias de ponta e uma 
            interface elegante, oferece aos profissionais de segurança uma ferramenta poderosa para 
            monitoramento em tempo real.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Com foco na usabilidade e performance, o dashboard apresenta dados complexos de forma 
            clara e acionável, permitindo resposta rápida a ameaças potenciais e análise detalhada 
            de padrões de comportamento.
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
          <CardTitle>Tecnologias Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader>
          <CardTitle>Equipe de Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{member.avatar}</span>
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              Repositório
            </Button>
            <Button variant="outline" className="gap-2">
              <Globe className="h-4 w-4" />
              Documentação
            </Button>
            <Button variant="outline" className="gap-2">
              <Info className="h-4 w-4" />
              Suporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>© 2024 Percepta Dashboard. Desenvolvido com ❤️ para segurança digital.</p>
      </div>
    </div>
  );
}
