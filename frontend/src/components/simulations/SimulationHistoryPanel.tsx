import { SimulationResult } from "../../types/simulation";
import { formatNumber, formatScientific } from "../../utils/formatters";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardTitle } from "../ui/Card";

interface Props {
  rows: SimulationResult[];
  onSelect: (result: SimulationResult) => void;
  onClear: () => void;
}

export function SimulationHistoryPanel({ rows, onSelect, onClear }: Props) {
  if (!rows.length) return null;
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <CardTitle>Historial comparativo</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Guarda las últimas simulaciones para volver a comparar modelos, parámetros y resultados.</p>
        </div>
        <Button type="button" variant="ghost" onClick={onClear}>Limpiar</Button>
      </div>
      <div className="space-y-3">
        {rows.slice(0, 5).map((row, index) => {
          const stability = typeof row.stability === "string" ? row.stability : row.stability?.classification;
          return (
            <button key={`${row.model_type}-${index}`} type="button" onClick={() => onSelect(row)} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-sentinel-200 hover:bg-sentinel-50/50">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{row.model_type ?? "modelo"}</p>
                  <p className="mt-1 text-xs text-slate-500">Método {row.method_used ?? "analítico"} · Max V {formatScientific(row.max_viral_load)} · Max I {formatNumber(row.max_infected, 1)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.risk?.risk_level && <Badge risk={row.risk.risk_level} />}
                  {stability && <Badge tone="cyan">{stability}</Badge>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
