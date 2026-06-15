import { Area, CartesianGrid, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LocationForecast } from "../../types/analytics";
import { formatDate, formatNumber, formatScientific } from "../../utils/formatters";

interface ForecastChartProps {
  forecast: LocationForecast;
}

interface ForecastRow {
  date: string;
  actual?: number;
  predicted?: number;
  lower?: number;
  upper?: number;
  mitigation?: number;
  highGrowth?: number;
}

export function ForecastChart({ forecast }: ForecastChartProps) {
  const rowsByDate = new Map<string, ForecastRow>();

  forecast.history.forEach((item) => {
    rowsByDate.set(item.sample_date, {
      date: item.sample_date,
      actual: item.viral_concentration_gc_l ?? 0,
    });
  });

  forecast.forecast.forEach((item) => {
    const current = rowsByDate.get(item.sample_date) ?? { date: item.sample_date };
    current.predicted = item.predicted_viral_concentration_gc_l;
    current.lower = item.lower_bound;
    current.upper = item.upper_bound;
    rowsByDate.set(item.sample_date, current);
  });

  const mitigation = forecast.scenarios.find((scenario) => scenario.name.toLowerCase().includes("mitig"));
  const highGrowth = forecast.scenarios.find((scenario) => scenario.name.toLowerCase().includes("alto"));

  mitigation?.series.forEach((item) => {
    const current = rowsByDate.get(item.sample_date) ?? { date: item.sample_date };
    current.mitigation = item.predicted_viral_concentration_gc_l;
    rowsByDate.set(item.sample_date, current);
  });

  highGrowth?.series.forEach((item) => {
    const current = rowsByDate.get(item.sample_date) ?? { date: item.sample_date };
    current.highGrowth = item.predicted_viral_concentration_gc_l;
    rowsByDate.set(item.sample_date, current);
  });

  const rows = Array.from(rowsByDate.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const high = forecast.thresholds?.high ?? 100000;
  const critical = forecast.thresholds?.critical ?? 1000000;

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer>
        <ComposedChart data={rows} margin={{ top: 12, right: 24, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#67e8f9" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={28} />
          <YAxis tickFormatter={formatScientific} width={82} />
          <Tooltip
            labelFormatter={formatDate}
            formatter={(value, name) => {
              const label = String(name);
              const numericValue = Number(value);
              if (label.includes("Cambio")) return [`${formatNumber(numericValue, 1)}%`, label];
              return [formatScientific(numericValue), label];
            }}
          />
          <Legend />
          <ReferenceLine y={high} stroke="#f59e0b" strokeDasharray="6 6" label="Umbral alto" />
          <ReferenceLine y={critical} stroke="#dc2626" strokeDasharray="6 6" label="Umbral crítico" />
          <Area type="monotone" dataKey="upper" name="Banda superior" fill="url(#forecastBand)" stroke="none" connectNulls />
          <Area type="monotone" dataKey="lower" name="Banda inferior" fill="#ffffff" stroke="none" connectNulls />
          <Line type="monotone" dataKey="actual" name="Histórico observado" stroke="#0891b2" strokeWidth={3} dot={false} connectNulls />
          <Line type="monotone" dataKey="predicted" name="Predicción base" stroke="#7c3aed" strokeWidth={3} strokeDasharray="7 5" dot={false} connectNulls />
          <Line type="monotone" dataKey="mitigation" name="Escenario mitigación" stroke="#16a34a" strokeWidth={2} strokeDasharray="4 4" dot={false} connectNulls />
          <Line type="monotone" dataKey="highGrowth" name="Escenario crecimiento alto" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 4" dot={false} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
