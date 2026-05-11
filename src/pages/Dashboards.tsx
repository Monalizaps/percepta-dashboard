import { useState } from 'react';
import { ExternalLink, FolderGit2, Plus, RefreshCw, Shield, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useDashboards } from '@/hooks/useDashboards';

function AddDashboardDialog({ onCreate }: { onCreate: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { create } = useDashboards();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectUrl.trim()) return;
    setSubmitting(true);
    try {
      await create({ name: name.trim() || undefined, projectUrl: projectUrl.trim(), token: token.trim() || undefined });
      toast({ title: 'Dashboard criado!', description: `Projeto adicionado ao Percepta.` });
      setName('');
      setProjectUrl('');
      setToken('');
      setOpen(false);
      onCreate();
    } catch (err) {
      toast({
        title: 'Erro ao criar dashboard',
        description: err instanceof Error ? err.message : 'Falha desconhecida',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar projeto GitLab</DialogTitle>
          <DialogDescription>
            O token fica apenas em memória no processo local e nunca é persistido ou enviado a terceiros.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome (opcional)</Label>
            <Input
              id="name"
              placeholder="pet-planner"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectUrl">URL do projeto GitLab *</Label>
            <Input
              id="projectUrl"
              placeholder="https://gitlab.com/moneypereira/pet-planner"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Personal Access Token (read_api)</Label>
            <Input
              id="token"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="glpat-xxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Necessário para projetos privados e para acessar vulnerabilidades de segurança (plano GitLab Ultimate/Premium).
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || !projectUrl.trim()}>
              {submitting ? 'Conectando...' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboards() {
  const { dashboards, loading, error, remove, refresh } = useDashboards();
  const { toast } = useToast();

  const handleDelete = async (id: string, name: string) => {
    try {
      await remove(id);
      toast({ title: 'Dashboard removido', description: name });
    } catch {
      toast({ title: 'Erro ao remover', variant: 'destructive' });
    }
  };

  return (
    <SidebarProvider>
      <header className="h-14 flex items-center border-b border-border bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-50">
        <SidebarTrigger className="mr-4" />
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(13,211,255,0.8)]">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Percepta</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Project Dashboards</p>
          </div>
        </div>
        <AddDashboardDialog onCreate={refresh} />
      </header>

      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="space-y-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300 mb-1">Project Dashboards</p>
              <h1 className="text-3xl font-semibold text-foreground">Projetos Monitorados</h1>
              <p className="mt-2 text-muted-foreground">
                Cada dashboard conecta um projeto GitLab real e exibe suas vulnerabilidades normalizadas.
              </p>
            </div>

            {error && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
              </Card>
            )}

            {loading ? (
              <div className="flex items-center gap-3 text-muted-foreground py-12">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Carregando dashboards...</span>
              </div>
            ) : dashboards.length === 0 ? (
              <Card className="border-border/70 bg-card/50">
                <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                  <FolderGit2 className="h-12 w-12 text-muted-foreground/40" />
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Nenhum projeto ainda</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Clique em "Novo Dashboard" e informe a URL do seu projeto GitLab.
                    </p>
                  </div>
                  <AddDashboardDialog onCreate={refresh} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {dashboards.map((d) => (
                  <Card
                    key={d.id}
                    className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)] hover:border-primary/40 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-cyan-400" />
                          <Badge variant="outline" className="text-xs border-cyan-400/40 text-cyan-300">
                            {d.source}
                          </Badge>
                        </div>
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                          aria-label="Remover dashboard"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <CardTitle className="text-lg text-foreground mt-2">{d.name}</CardTitle>
                      <p className="text-xs text-muted-foreground font-mono">{d.projectPath}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Adicionado em {new Date(d.createdAt).toLocaleString('pt-BR')}
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboards/${d.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Ver Findings
                        </Link>
                        <a
                          href={d.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg border border-border/70 hover:bg-white/5 transition-colors text-muted-foreground"
                          aria-label="Abrir no GitLab"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
