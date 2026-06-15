import { CartesianGrid, Legend, ReferenceArea, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { SimulationResult } from "../../types/simulation";
import { getBifurcationData } from "../../utils/chartUtils";
import { formatNumber } from "../../utils/formatters";

export function BifurcationChart({ result }: { result?: SimulationResult }) {
  const data = getBifurcationData(result);
  const stable = data.filter((p) => p.stable === true || p.stability === "stable");
  const unstable = data.filter((p) => p.stable === false || p.stability === "unstable");
  const threshold = Number(result?.parameters?.threshold ?? result?.parameters?.gamma ?? result?.parameters?.beta_threshold);
  const paramValues = data.map((p) => Number(p.parameter_value)).filter(Number.isFinite);
  const eqValues = data.map((p) => Number(p.equilibrium_value)).filter(Number.isFinite);
  const minParam = Math.min(...paramValues, threshold || 0);
  const maxParam = Math.max(...paramValues, threshold || 0);
  const minEq = Math.min(...eqValues, 0);
  const maxEq = Math.max(...eqValues, 0);
  const parameterName = String(result?.parameters?.parameter_name ?? "parámetro");
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-slate-600">
        Diagrama de bifurcación: ramas azules representan equilibrios estables y ramas rojas equilibrios inestables. La línea vertical marca el umbral donde cambia la dinámica del sistema.
      </div>
      <div className="h-[500px] rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 24, right: 36, bottom: 32, left: 14 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="parameter_value" name="Parametro" type="number" domain={[minParam, maxParam]} tickFormatter={(value) => formatNumber(Number(value), 2)} label={{ value: parameterName, position: "insideBottom", offset: -12 }} />
            <YAxis dataKey="equilibrium_value" name="Equilibrio" type="number" domain={[minEq, maxEq]} tickFormatter={(value) => formatNumber(Number(value), 0)} label={{ value: "Equilibrio", angle: -90, position: "insideLeft" }} />
            <ZAxis range={[34, 34]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [formatNumber(Number(value), 2), String(name)]} />
            <Legend verticalAlign="top" />
            {Number.isFinite(threshold) && (
              <>
                <ReferenceLine x={threshold} stroke="#ea580c" strokeDasharray="7 5" label="umbral" />
                <ReferenceArea x1={threshold} x2={maxParam} fill="#fef3c7" fillOpacity={0.35} label="régimen activo" />
              </>
            )}
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
            <Scatter name="Rama estable" data={stable} fill="#0891b2" line={{ stroke: "#0891b2", strokeWidth: 3 }} shape="circle" />
            <Scatter name="Rama inestable" data={unstable} fill="#dc2626" line={{ stroke: "#dc2626", strokeWidth: 2, strokeDasharray: "6 5" }} shape="triangle" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
