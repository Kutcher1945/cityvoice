import axios from "axios";

// All requests go through the Next.js proxy at /api/backend
// which forwards them to the Django backend server-side (no CORS)
const baseURL =
  typeof window !== "undefined"
    ? "/api/backend/cityvoice"
    : `${process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1"}/cityvoice`;

const axiosInstance = axios.create({
  baseURL,
  paramsSerializer: (params) => new URLSearchParams(params).toString(),
});

export const api = axiosInstance;
