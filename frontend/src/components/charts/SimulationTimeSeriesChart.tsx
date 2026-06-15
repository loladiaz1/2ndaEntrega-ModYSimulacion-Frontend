import { Brush, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SimulationResult } from "../../types/simulation";
import { combineTimeSeries } from "../../utils/chartUtils";
import { formatScientific } from "../../utils/formatters";

const colors = ["#0891b2", "#f97316", "#16a34a", "#7c3aed", "#dc2626"];

export function SimulationTimeSeriesChart({ result }: { result?: SimulationResult }) {
  const rows = combineTimeSeries(result);
  const keys = Object.keys(result?.series ?? {});
  const maxInfectionTime = Number(result?.max_infection_time);
  const maxViralTime = Number(result?.max_viral_load_time);
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
        Serie temporal simulada. Usá el selector inferior para acercar la zona de interés y comparar máximos, convergencia, oscilaciones o saturación.
      </div>
      <div className="h-[460px] rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
        <ResponsiveContainer>
          <LineChart data={rows} margin={{ top: 20, right: 30, bottom: 35, left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="t" label={{ value: "Tiempo", position: "insideBottom", offset: -18 }} />
            <YAxis tickFormatter={formatScientific} label={{ value: "Magnitud", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value: number) => formatScientific(value)} labelFormatter={(value) => `t = ${value}`} />
            <Legend verticalAlign="top" />
            {Number.isFinite(maxInfectionTime) && <ReferenceLine x={maxInfectionTime} stroke="#f97316" strokeDasharray="6 6" label="max I" />}
            {Number.isFinite(maxViralTime) && <ReferenceLine x={maxViralTime} stroke="#0891b2" strokeDasharray="6 6" label="max V" />}
            {keys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={3} dot={false} activeDot={{ r: 5 }} connectNulls />
            ))}
            <Brush dataKey="t" height={24} stroke="#0891b2" travellerWidth={10} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
