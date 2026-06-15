import { RiskLevel, NumericRecord } from "./common";

export type Method = "euler" | "heun" | "rk4";

export interface MethodComparisonRow {
  method: Method | string;
  label?: string;
  final_value?: number;
  max_value?: number;
  max_time?: number;
  final_I?: number;
  final_V?: number;
  max_I?: number;
  max_I_time?: number;
  max_V?: number;
  max_V_time?: number;
}

export interface SimulationResult {
  model_type?: string;
  parameters?: NumericRecord & Record<string, unknown>;
  initial_conditions?: NumericRecord;
  time?: number[];
  series?: Record<string, number[]>;
  equilibria?: unknown;
  stability?: string | { classification?: string; eigenvalues?: unknown[]; explanation?: string; [key: string]: unknown };
  risk?: { risk_level?: RiskLevel | string; risk_score?: number; trend?: string; explanation?: string; [key: string]: unknown };
  interpretation?: string;
  saved_simulation_id?: number;
  max_infected?: number;
  max_viral_load?: number;
  max_infection_time?: number;
  max_viral_load_time?: number;
  method_used?: Method | string;
  method_comparison?: {
    type?: "scalar" | "vector" | string;
    rows?: MethodComparisonRow[];
  };
  eigenvalues?: number[];
  event_window?: [number, number];
  bifurcation_points?: Array<Record<string, number | string | boolean>>;
  phase_points?: Array<Record<string, number>>;
  nullcline_points?: {
    dV_dt?: Array<Record<string, number>>;
    dI_dt?: Array<Record<string, number>>;
  };
  lyapunov?: {
    time?: number[];
    values?: number[];
    trend?: string;
    increasing?: boolean;
    safe_region_violations?: number;
    explanation?: string;
    I_safe?: number;
    V_safe?: number;
  };
}
