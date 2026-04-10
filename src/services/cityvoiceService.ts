import { api } from "@/utils/api";

export interface Report {
  id: number;
  category: string;
  category_display: string;
  custom_category: string;
  description: string;
  photo: string | null;
  photo_url: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  status: "new" | "in_progress" | "resolved";
  status_display: string;
  upvotes: number;
  city: string;
  city_display: string;
  author_name: string;
  created_at: string;
  days_open: number;
}

export interface ReportListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Report[];
}

export interface StatsResponse {
  total: number;
  resolved: number;
  cities: Record<string, number>;
}

export type ReportOrdering = "-created_at" | "-upvotes" | "created_at";
export type ReportCity = "almaty" | "astana" | "tashkent";
export type ReportCategory = "roads" | "trash" | "lighting" | "transport" | "parks" | "other";
export type ReportStatus = "new" | "in_progress" | "resolved";

export interface ReportFilters {
  city?: ReportCity;
  category?: ReportCategory;
  status?: ReportStatus;
  ordering?: ReportOrdering;
}

// List reports with optional filters
export const fetchReports = (filters: ReportFilters = {}) =>
  api.get<Report[]>("/reports/", { params: filters });

// Get single report
export const fetchReport = (id: number) =>
  api.get<Report>(`/reports/${id}/`);

// Create a new report (multipart/form-data for photo upload)
export const createReport = (formData: FormData) =>
  api.post<Report>("/reports/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Upvote a report
export const upvoteReport = (id: number) =>
  api.post<{ upvotes: number }>(`/reports/${id}/upvote/`);

// Get aggregate stats
export const fetchStats = () =>
  api.get<StatsResponse>("/stats/");
