import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Syringe, Trash2, Droplets, TrendingUp, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  InsulinType,
  MealContext,
  INSULIN_TYPE_LABELS,
  MEAL_CONTEXT_LABELS,
  INSULIN_TYPE_COLORS,
  INSULIN_TYPE_DOT_COLORS,
  getGlycemiaZone,
} from '@/types/insulin';
import { useInsulinLogs, useWeeklyInsulinStats, useAddInsulinLog, useRemoveInsulinLog } from '@/hooks/useInsulin';

// ─── Form Tab ────────────────────────────────────────────────────────────────

function RegisterTab() {
  const [insulinType, setInsulinType] = useState<InsulinType>('rapide');
  const [insulinName, setInsulinName] = useState('');
  const [dose, setDose] = useState('');
  const [mealContext, setMealContext] = useState<MealContext>('avant_repas');
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [notes, setNotes] = useState('');
  const addLog = useAddInsulinLog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dose || isNaN(Number(dose)) || Number(dose) <= 0) return;

    const now = new Date();
    await addLog.mutateAsync({
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
      insulin_type: insulinType,
      insulin_name: insulinName || null,
      dose_units: Number(dose),
      meal_context: mealContext,
      blood_glucose: bloodGlucose ? Number(bloodGlucose) : null,
      notes: notes || null,
    });

    setDose('');
    setBloodGlucose('');
    setNotes('');
    setInsulinName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type d'insuline */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Type d'insuline</Label>
        <div className="grid grid-cols-3 gap-2">
          {(['rapide', 'lente', 'mixte'] as InsulinType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setInsulinType(type)}
              className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                insulinType === type
                  ? INSULIN_TYPE_COLORS[type] + ' scale-105 shadow-sm'
                  : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              <div className={`mx-auto mb-1 h-2 w-2 rounded-full ${insulinType === type ? INSULIN_TYPE_DOT_COLORS[type] : 'bg-muted-foreground/40'}`} />
              {INSULIN_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Nom de l'insuline */}
      <div className="space-y-2">
        <Label htmlFor="insulinName" className="text-sm font-medium text-foreground">
          Nom de l'insuline <span className="text-muted-foreground">(optionnel)</span>
        </Label>
        <Input
          id="insulinName"
          placeholder="ex: Novorapid, Lantus, Toujeo…"
          value={insulinName}
          onChange={(e) => setInsulinName(e.target.value)}
        />
      </div>

      {/* Dose */}
      <div className="space-y-2">
        <Label htmlFor="dose" className="text-sm font-semibold text-foreground">
          Dose (unités)
        </Label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDose((prev) => String(Math.max(0, Number(prev) - 1)))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-lg font-bold transition-colors hover:bg-muted/80"
          >
            −
          </button>
          <Input
            id="dose"
            type="number"
            min="0"
            step="0.5"
            placeholder="0"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="text-center text-lg font-bold"
            required
          />
          <button
            type="button"
            onClick={() => setDose((prev) => String(Number(prev) + 1))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-lg font-bold transition-colors hover:bg-muted/80"
          >
            +
          </button>
          <span className="shrink-0 text-sm text-muted-foreground">UI</span>
        </div>
      </div>

      {/* Contexte repas */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Contexte</Label>
        <Select value={mealContext} onValueChange={(v) => setMealContext(v as MealContext)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(MEAL_CONTEXT_LABELS) as [MealContext, string][]).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Glycémie */}
      <div className="space-y-2">
        <Label htmlFor="glycemia" className="text-sm font-semibold text-foreground">
          Glycémie <span className="text-muted-foreground">(optionnel)</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="glycemia"
            type="number"
            min="0"
            placeholder="ex: 120"
            value={bloodGlucose}
            onChange={(e) => setBloodGlucose(e.target.value)}
          />
          <span className="shrink-0 text-sm text-muted-foreground">mg/dL</span>
        </div>
        {bloodGlucose && Number(bloodGlucose) > 0 && (
          <div className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${getGlycemiaZone(Number(bloodGlucose)).bgColor} ${getGlycemiaZone(Number(bloodGlucose)).color}`}>
            <Activity className="h-3 w-3" />
            Zone : {getGlycemiaZone(Number(bloodGlucose)).label}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-foreground">
          Notes <span className="text-muted-foreground">(optionnel)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Remarques, ressentis…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[72px]"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={addLog.isPending}>
        <Syringe className="mr-2 h-4 w-4" />
        {addLog.isPending ? 'Enregistrement…' : "Enregistrer l'injection"}
      </Button>
    </form>
  );
}

// ─── Journal Tab ─────────────────────────────────────────────────────────────

function JournalTab() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { data: logs = [], isLoading } = useInsulinLogs(selectedDate);
  const removeLog = useRemoveInsulinLog();

  const dateLabel = format(new Date(selectedDate + 'T12:00:00'), 'EEEE d MMMM yyyy', { locale: fr });

  return (
    <div className="space-y-4">
      {/* Date nav */}
      <div className="flex items-center justify-between rounded-xl bg-muted/40 p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedDate(format(subDays(new Date(selectedDate + 'T12:00:00'), 1), 'yyyy-MM-dd'))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium capitalize text-foreground">{dateLabel}</span>
        <Button
          variant="ghost"
          size="icon"
          disabled={selectedDate >= format(new Date(), 'yyyy-MM-dd')}
          onClick={() => setSelectedDate(format(addDays(new Date(selectedDate + 'T12:00:00'), 1), 'yyyy-MM-dd'))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center">
          <Syringe className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Aucune injection enregistrée ce jour</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{log.time}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${INSULIN_TYPE_COLORS[log.insulin_type as InsulinType]}`}>
                      {INSULIN_TYPE_LABELS[log.insulin_type as InsulinType]}
                    </span>
                    {log.insulin_name && (
                      <Badge variant="secondary" className="text-xs">{log.insulin_name}</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="font-bold text-foreground">{log.dose_units} UI</span>
                    <span className="text-muted-foreground">{MEAL_CONTEXT_LABELS[log.meal_context as MealContext]}</span>
                    {log.blood_glucose && (
                      <span className={`font-medium ${getGlycemiaZone(log.blood_glucose).color}`}>
                        🩸 {log.blood_glucose} mg/dL
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">{log.notes}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeLog.mutate(log.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab() {
  const { data: stats, isLoading } = useWeeklyInsulinStats();

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Chargement des statistiques…</div>;
  }

  if (!stats) return null;

  const glycemiaZone = stats.avgGlycemia ? getGlycemiaZone(stats.avgGlycemia) : null;
  const totalDoses = stats.dosesByType.rapide + stats.dosesByType.lente + stats.dosesByType.mixte;

  return (
    <div className="space-y-4">
      {/* Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Glycémie moy.</span>
            </div>
            {stats.avgGlycemia && glycemiaZone ? (
              <>
                <p className={`text-2xl font-bold ${glycemiaZone.color}`}>{stats.avgGlycemia}</p>
                <p className="text-xs text-muted-foreground">mg/dL · 7 jours</p>
                <div className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${glycemiaZone.bgColor} ${glycemiaZone.color}`}>
                  {glycemiaZone.label}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune donnée</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Doses totales</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalDoses}</p>
            <p className="text-xs text-muted-foreground">UI · 7 jours</p>
            <div className="mt-2 space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-primary">Rapide</span>
                <span className="font-medium text-foreground">{stats.dosesByType.rapide} UI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Lente</span>
                <span className="font-medium text-foreground">{stats.dosesByType.lente} UI</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Glycemia chart */}
      <Card className="border-border">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold text-foreground">Glycémie 7 jours (mg/dL)</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.dailyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value} mg/dL`, 'Glycémie']}
              />
              <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={140} stroke="#f97316" strokeDasharray="4 2" strokeWidth={1} label={{ value: '140', position: 'right', fontSize: 10, fill: '#f97316' }} />
              <Bar
                dataKey="glycemia"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Glycémie"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-primary/30" /> Normale (&lt;140)</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-4 rounded bg-destructive/30" /> Élevée (140–180)</span>
          </div>
        </CardContent>
      </Card>

      {/* Recap table */}
      <Card className="border-border">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold text-foreground">Injections cette semaine</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-2">
            {(['rapide', 'lente', 'mixte'] as InsulinType[]).map((type) => (
              <div key={type} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${INSULIN_TYPE_DOT_COLORS[type]}`} />
                  <span className="text-sm font-medium text-foreground">{INSULIN_TYPE_LABELS[type]}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">{stats.countsByType[type]} inj.</span>
                  <span className="font-semibold text-foreground">{stats.dosesByType[type]} UI</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Insulin() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Syringe className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Suivi insuline</h1>
          <p className="text-xs text-muted-foreground">Injections & glycémie</p>
        </div>
      </div>

      <Tabs defaultValue="enregistrer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enregistrer">Enregistrer</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="enregistrer" className="mt-4">
          <RegisterTab />
        </TabsContent>

        <TabsContent value="journal" className="mt-4">
          <JournalTab />
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <StatsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
