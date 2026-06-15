import { FormEvent, useState } from "react";
import { runInfectionWastewater } from "../../api/simulationsApi";
import { getApiErrorMessage } from "../../api/client";
import { SimulationResult } from "../../types/simulation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { ErrorState } from "../ui/ErrorState";
import { methodOptions, toNumberPayload } from "./formUtils";

const initial = { beta: "0.35", K: "100000", gamma: "0.12", alpha: "25", k: "0.15", d: "0.05", I0: "100", V0: "5000", t_final: "90", step: "0.5", method: "rk4" };

const presets = [
  { label: "Control efectivo", values: { beta: "0.22", K: "100000", gamma: "0.16", alpha: "6", k: "0.18", d: "0.08", I0: "80", V0: "6000", t_final: "100", step: "0.5", method: "rk4" } },
  { label: "Brote visible", values: { beta: "0.45", K: "120000", gamma: "0.10", alpha: "12", k: "0.12", d: "0.04", I0: "150", V0: "9000", t_final: "100", step: "0.5", method: "rk4" } },
  { label: "Pico y descenso", values: { beta: "0.34", K: "80000", gamma: "0.20", alpha: "4", k: "0.20", d: "0.10", I0: "500", V0: "12000", t_final: "90", step: "0.5", method: "rk4" } },
];

function choosePreset() {
  return presets[Math.floor(Math.random() * presets.length)].values;
}

export function InfectionWastewaterForm({ onResult }: { onResult: (result: SimulationResult) => void }) {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      onResult(await runInfectionWastewater(toNumberPayload(values, ["method"])));
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
        <Button type="button" variant="ghost" onClick={() => setValues(choosePreset())}>Escenario aleatorio</Button>
        {presets.map((preset) => <Button key={preset.label} type="button" variant="ghost" onClick={() => setValues(preset.values)}>{preset.label}</Button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Object.keys(initial).filter((key) => key !== "method").map((key) => (
          <Input key={key} label={key} value={values[key as keyof typeof values]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
        ))}
        <Select label="Metodo" value={values.method} options={methodOptions} onChange={(e) => setValues({ ...values, method: e.target.value })} />
      </div>
      <Button disabled={loading}>{loading ? "Simulando..." : "Ejecutar modelo 2D"}</Button>
    </form>
  );
}
