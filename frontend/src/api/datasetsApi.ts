import { apiClient } from "./client";

export interface DatasetSummary {
  total_measurements?: number;
  locations?: number;
  date_from?: string;
  date_to?: string;
  avg_viral_concentration_gc_l?: number;
  max_viral_concentration_gc_l?: number;
}

interface RawDatasetSummary extends DatasetSummary {
  active_locations?: number;
  date_range?: {
    from?: string;
    to?: string;
  };
  average_viral_concentration?: number;
  max_viral_concentration?: number;
}

function normalizeSummary(summary: RawDatasetSummary): DatasetSummary {
  return {
    total_measurements: summary.total_measurements,
    locations: summary.locations ?? summary.active_locations,
    date_from: summary.date_from ?? summary.date_range?.from,
    date_to: summary.date_to ?? summary.date_range?.to,
    avg_viral_concentration_gc_l: summary.avg_viral_concentration_gc_l ?? summary.average_viral_concentration,
    max_viral_concentration_gc_l: summary.max_viral_concentration_gc_l ?? summary.max_viral_concentration,
  };
}

export async function uploadCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/datasets/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function seedDemo() {
  const { data } = await apiClient.post("/datasets/seed-demo");
  return data;
}

export async function getDatasetSummary() {
  const { data } = await apiClient.get<RawDatasetSummary>("/datasets/summary");
  return normalizeSummary(data);
}
