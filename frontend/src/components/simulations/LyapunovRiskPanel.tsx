import { SimulationResult } from "../../types/simulation";
import { formatNumber, formatScientific } from "../../utils/formatters";
import { RiskTrendChart } from "../charts/RiskTrendChart";
import { Badge } from "../ui/Badge";
import { Card, CardTitle } from "../ui/Card";

export function LyapunovRiskPanel({ result }: { result?: SimulationResult }) {
  const lyapunov = result?.lyapunov;
  const tone = lyapunov?.increasing ? "red" : lyapunov?.trend === "decreasing" ? "green" : "amber";
  const label = lyapunov?.increasing ? "Riesgo creciente" : lyapunov?.trend === "decreasing" ? "Riesgo decreciente" : "Riesgo estable";
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <CardTitle>Region segura / Lyapunov</CardTitle>
        {lyapunov && <Badge tone={tone}>{label}</Badge>}
      </div>
      <p className="text-sm leading-6 text-slate-600">
        Funcion de riesgo: <span className="font-semibold">V_risk(I,V) = a max(0, I - I_safe)^2 + b max(0, V - V_safe)^2</span>. Permite evaluar si la trayectoria se mantiene dentro de una zona epidemiologica segura.
      </p>
      {lyapunov?.values?.length ? (
        <div className="mt-4 space-y-3">
          <RiskTrendChart time={lyapunov.time} values={lyapunov.values} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="I seguro" value={formatNumber(lyapunov.I_safe, 0)} />
            <Metric label="V seguro" value={formatScientific(lyapunov.V_safe)} />
            <Metric label="Violaciones" value={formatNumber(lyapunov.safe_region_violations, 0)} />
          </div>
          {lyapunov.explanation && <p className="text-sm text-slate-600">{lyapunov.explanation}</p>}
        </div>
      ) : (
        <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-500">Ejecuta el modelo 2D para obtener una trayectoria V_risk(t) y detectar violaciones de region segura.</p>
      )}
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-3"><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>;
}
