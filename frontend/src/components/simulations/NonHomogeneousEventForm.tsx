import { FormEvent, useState } from "react";
import { runNonHomogeneousEvent } from "../../api/simulationsApi";
import { getApiErrorMessage } from "../../api/client";
import { SimulationResult } from "../../types/simulation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { ErrorState } from "../ui/ErrorState";
import { methodOptions, toNumberPayload } from "./formUtils";

const initial = { event_type: "outbreak_shock", base_source: "50000", amplitude: "15000", frequency: "0.1", shock_start: "15", shock_end: "25", shock_magnitude: "90000", rainfall_start: "35", rainfall_end: "45", dilution_multiplier: "1.8", k: "0.15", d: "0.05", V0: "10000", t_final: "70", step: "0.5", method: "rk4" };

const presets = [
  { label: "Brote repentino", values: { event_type: "outbreak_shock", base_source: "45000", amplitude: "10000", frequency: "0.08", shock_start: "18", shock_end: "32", shock_magnitude: "130000", rainfall_start: "42", rainfall_end: "50", dilution_multiplier: "1.4", k: "0.12", d: "0.05", V0: "10000", t_final: "85", step: "0.5", method: "rk4" } },
  { label: "Lluvia intensa", values: { event_type: "rainfall_dilution", base_source: "75000", amplitude: "8000", frequency: "0.05", shock_start: "20", shock_end: "26", shock_magnitude: "60000", rainfall_start: "30", rainfall_end: "48", dilution_multiplier: "2.2", k: "0.14", d: "0.06", V0: "25000", t_final: "90", step: "0.5", method: "rk4" } },
  { label: "Onda periodica", values: { event_type: "sinusoidal", base_source: "55000", amplitude: "30000", frequency: "0.16", shock_start: "20", shock_end: "28", shock_magnitude: "80000", rainfall_start: "45", rainfall_end: "55", dilution_multiplier: "1.6", k: "0.10", d: "0.04", V0: "9000", t_final: "100", step: "0.5", method: "rk4" } },
];

function choosePreset() {
  return presets[Math.floor(Math.random() * presets.length)].values;
}

export function NonHomogeneousEventForm({ onResult }: { onResult: (result: SimulationResult) => void }) {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      onResult(await runNonHomogeneousEvent(toNumberPayload(values, ["event_type", "method"])));
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
        <Button type="button" variant="ghost" onClick={() => setValues(choosePreset())}>Evento aleatorio</Button>
        {presets.map((preset) => <Button key={preset.label} type="button" variant="ghost" onClick={() => setValues(preset.values)}>{preset.label}</Button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Select label="Tipo de evento" value={values.event_type} options={["constant", "sinusoidal", "outbreak_shock", "rainfall_dilution"].map((v) => ({ label: v, value: v }))} onChange={(e) => setValues({ ...values, event_type: e.target.value })} />
        <Select label="Metodo" value={values.method} options={methodOptions} onChange={(e) => setValues({ ...values, method: e.target.value })} />
        {Object.keys(initial).filter((key) => !["event_type", "method"].includes(key)).map((key) => (
          <Input key={key} label={key} value={values[key as keyof typeof values]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
        ))}
      </div>
      <p className="rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-500">Usá los presets para generar curvas más visibles: brotes abruptos, ondas periódicas o lluvias que modifican la señal viral.</p>
      <Button disabled={loading}>{loading ? "Simulando..." : "Ejecutar evento"}</Button>
    </form>
  );
}
