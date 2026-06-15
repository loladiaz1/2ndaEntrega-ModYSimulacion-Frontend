import { FormEvent, useState } from "react";
import { runPhaseDiagram } from "../../api/simulationsApi";
import { getApiErrorMessage } from "../../api/client";
import { SimulationResult } from "../../types/simulation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ErrorState } from "../ui/ErrorState";
import { toNumberPayload } from "./formUtils";

const initial = { I_min: "0", I_max: "100000", V_min: "0", V_max: "15000000", grid_size: "18", beta: "0.35", K: "100000", gamma: "0.12", alpha: "25", k: "0.15", d: "0.05" };

const presets = [
  { label: "Ventana completa", values: initial },
  { label: "Compacto claro", values: { I_min: "0", I_max: "100000", V_min: "0", V_max: "1000000", grid_size: "20", beta: "0.35", K: "100000", gamma: "0.12", alpha: "2", k: "0.15", d: "0.05" } },
  { label: "Brote fuerte", values: { I_min: "0", I_max: "120000", V_min: "0", V_max: "7000000", grid_size: "22", beta: "0.48", K: "120000", gamma: "0.10", alpha: "8", k: "0.14", d: "0.06" } },
  { label: "Control sanitario", values: { I_min: "0", I_max: "90000", V_min: "0", V_max: "2500000", grid_size: "20", beta: "0.24", K: "90000", gamma: "0.18", alpha: "5", k: "0.20", d: "0.10" } },
];

function choosePreset() {
  return presets[Math.floor(Math.random() * presets.length)].values;
}

export function PhaseDiagramForm({ onResult }: { onResult: (result: SimulationResult) => void }) {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      onResult(await runPhaseDiagram(toNumberPayload(values)));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <ErrorState message={error} />}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" onClick={() => setValues(choosePreset())}>Vista aleatoria</Button>
        {presets.map((preset) => <Button key={preset.label} type="button" variant="ghost" onClick={() => setValues(preset.values)}>{preset.label}</Button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Object.keys(initial).map((key) => (
          <Input key={key} label={key} value={values[key as keyof typeof values]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
        ))}
      </div>
      <Button disabled={loading}>{loading ? "Calculando..." : "Ver diagrama de fase"}</Button>
    </form>
  );
}
