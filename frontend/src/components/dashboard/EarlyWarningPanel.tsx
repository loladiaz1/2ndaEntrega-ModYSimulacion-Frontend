import { AlertTriangle, CheckCircle2, TrendingUp, ShieldAlert } from "lucide-react";
import { LocationAnalytics, RiskResult } from "../../types/analytics";
import { formatPercentTrend } from "../../utils/formatters";
import { Badge } from "../ui/Badge";
import { Card, CardTitle } from "../ui/Card";

export function EarlyWarningPanel({ analytics, risk }: { analytics?: LocationAnalytics; risk?: RiskResult }) {
  const warning = analytics?.early_warning ?? risk?.early_warning;
  const mergedRisk = analytics?.risk ?? risk;
  const trend7 = risk?.trend_7d ?? analytics?.risk?.trend_7d ?? analytics?.variation_7d;
  const trend14 = risk?.trend_14d ?? analytics?.risk?.trend_14d ?? analytics?.variation_14d;
  return (
    <Card className={warning ? "border-red-200 bg-red-50/40" : "border-emerald-200 bg-emerald-50/30"}>
      <div className="flex items-start gap-3">
        <div className={warning ? "rounded-lg bg-red-100 p-2 text-red-700" : "rounded-lg bg-emerald-100 p-2 text-emerald-700"}>
          {warning ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{warning ? "Alerta temprana activa" : "Sin alerta temprana critica"}</CardTitle>
            <Badge risk={mergedRisk?.risk_level} />
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {analytics?.explanation ?? risk?.explanation ?? "El panel compara señales de aguas residuales, tendencia reciente y casos clínicos para detectar anticipación epidemiológica."}
          </p>
          <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200"><TrendingUp className="h-3 w-3" /> 7d {formatPercentTrend(trend7)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200"><TrendingUp className="h-3 w-3" /> 14d {formatPercentTrend(trend14)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200"><ShieldAlert className="h-3 w-3" /> Score {mergedRisk?.risk_score ?? "-"}/100</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
