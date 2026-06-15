import { CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { SimulationResult } from "../../types/simulation";
import { getEquilibriumPoints, getPhaseData } from "../../utils/chartUtils";
import { formatNumber, formatScientific } from "../../utils/formatters";

export function PhaseDiagramChart({ result }: { result?: SimulationResult }) {
  const data = getPhaseData(result);
  const equilibria = getEquilibriumPoints(result);
  const dVNullcline = result?.nullcline_points?.dV_dt ?? [];
  const dINullcline = result?.nullcline_points?.dI_dt ?? [];
  return (
    <div className="h-96">
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 28, bottom: 12, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="I" name="Infectados I" type="number" tickFormatter={(value) => formatNumber(Number(value), 0)} />
          <YAxis dataKey="V" name="Carga viral V" type="number" tickFormatter={(value) => formatScientific(Number(value))} />
          <ZAxis dataKey="magnitude" range={[18, 90]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => [typeof value === "number" ? formatScientific(value) : String(value), String(name)]}
          />
          <Legend />
          <Scatter name="Campo vectorial" data={data} fill="#0891b2" fillOpacity={0.45} />
          <Scatter name="Nulclina dV/dt = 0" data={dVNullcline} fill="#7c3aed" line shape="circle" />
          <Scatter name="Nulclina dI/dt = 0" data={dINullcline} fill="#f97316" line shape="circle" />
          <Scatter name="Equilibrios" data={equilibria} fill="#dc2626" shape="star" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
