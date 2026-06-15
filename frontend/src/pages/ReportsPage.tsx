import { useEffect, useState } from "react";
import { getExecutiveReport, getMeasurementsCsvUrl, ExecutiveReport } from "../api/analyticsApi";
import { apiBaseUrl, getApiErrorMessage } from "../api/client";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { formatDate, formatNumber, formatPercentTrend, formatScientific } from "../utils/formatters";

export function ReportsPage() {
  const [report, setReport] = useState<ExecutiveReport & { predictive_ranking?: any[]; map_risk?: any[] }>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExecutiveReport()
      .then(setReport)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  function downloadJson() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wastewater-sentinel-report.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Reportes y exportacion" description="Genera un resumen ejecutivo del monitoreo, recomendaciones, ranking predictivo, mapeo academico y exportacion CSV/JSON." />
      {error && <div className="mb-4"><ErrorState message={error} /></div>}
      {loading ? <LoadingState /> : report ? (
        <div className="space-y-6">
          <Card className="border-sentinel-100 bg-gradient-to-r from-sentinel-50 via-white to-cyan-50">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap gap-2"><Badge risk={report.overview?.latest_risk_level} /><Badge tone="cyan">Reporte ejecutivo</Badge></div>
                <h2 className="text-2xl font-bold text-slate-950">{report.title}</h2>
                <p className="mt-2 text-sm text-slate-600">Generado: {formatDate(report.generated_at)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadJson}>Descargar JSON</Button>
                <a href={apiBaseUrl + "/analytics/report/html"} target="_blank" rel="noreferrer"><Button variant="ghost">Reporte imprimible</Button></a>
                <a href={getMeasurementsCsvUrl()}><Button variant="secondary">Exportar CSV</Button></a>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Mediciones" value={formatNumber(report.overview?.total_measurements)} />
            <Metric label="Ubicaciones" value={formatNumber(report.overview?.active_locations)} />
            <Metric label="Tendencia 14d" value={formatPercentTrend(report.overview?.trend_14d ?? report.overview?.trend_last_14_days)} />
            <Metric label="Alertas" value={formatNumber(report.summary?.early_warning_locations)} />
          </div>

          <Card>
            <CardTitle>Recomendaciones</CardTitle>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              {report.recommendations.map((item) => <li key={item} className="rounded-md bg-slate-50 p-3">{item}</li>)}
            </ul>
          </Card>

          {report.predictive_ranking?.length ? (
            <Card>
              <CardTitle>Ranking predictivo para el informe</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Ordenado por score predictivo, riesgo proyectado y crecimiento esperado.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Ubicacion</th><th className="px-4 py-3">Riesgo proyectado</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Cambio</th><th className="px-4 py-3">Maximo predicho</th></tr></thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {report.predictive_ranking.slice(0, 8).map((row) => <tr key={row.location_name}><td className="px-4 py-3 font-medium text-slate-900">{row.location_name}</td><td className="px-4 py-3"><Badge risk={row.forecast_risk_level} /></td><td className="px-4 py-3 text-slate-600">{formatNumber(row.predictive_score, 1)}</td><td className="px-4 py-3 text-slate-600">{formatPercentTrend(row.projected_change_percent)}</td><td className="px-4 py-3 text-slate-600">{formatScientific(row.max_predicted_viral_concentration_gc_l)}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}

          <Card>
            <CardTitle>Relacion con Modelado y Simulacion</CardTitle>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Tema</th><th className="px-4 py-3">Aplicacion</th></tr></thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {report.academic_mapping.map((row) => <tr key={row.topic}><td className="px-4 py-3 font-medium text-slate-900">{row.topic}</td><td className="px-4 py-3 text-slate-600">{row.application}</td></tr>)}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card className="p-4"><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-xl font-bold text-slate-950">{value}</p></Card>;
}
