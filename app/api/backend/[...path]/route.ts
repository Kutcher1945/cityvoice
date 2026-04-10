import { NextRequest } from "next/server";
import axios from "axios";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  (process.env.NODE_ENV === "production"
    ? (() => { throw new Error("❌ BACKEND_API_URL is not set in production"); })()
    : "http://127.0.0.1:8000/api/v1");

function buildBackendUrl(req: NextRequest): string {
  const frontendPrefix = "/api/backend";
  const backendPrefix = BACKEND_URL.replace(/\/$/, "");

  let pathSuffix = req.nextUrl.pathname.replace(frontendPrefix, "");
  if (!pathSuffix.endsWith("/")) pathSuffix += "/";

  const endpoint = `${backendPrefix}${pathSuffix}`;
  const query = req.nextUrl.searchParams.toString();
  return query ? `${endpoint}?${query}` : endpoint;
}

async function forwardRequest(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  req: NextRequest
): Promise<Response> {
  const url = buildBackendUrl(req);

  const headers: Record<string, string> = {};

  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  const cookie = req.headers.get("cookie");
  if (cookie) headers["Cookie"] = cookie;

  const csrf = req.headers.get("x-csrftoken");
  if (csrf) headers["X-CSRFToken"] = csrf;

  // Handle multipart (file upload) vs JSON
  const contentType = req.headers.get("content-type") ?? "";
  let body: FormData | string | undefined;

  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      body = fd as unknown as FormData;
      // Let axios set the correct Content-Type with boundary
    } else {
      headers["Content-Type"] = "application/json";
      body = await req.text();
    }
  }

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
      withCredentials: true,
      timeout: 25000,
    });

    const resHeaders = new Headers({ "Content-Type": "application/json" });
    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const c of cookies) resHeaders.append("Set-Cookie", c);
    }

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string; response?: { status?: number; data?: unknown } };
    return new Response(
      JSON.stringify({
        error: err.message,
        code: err.code,
        details: err.response?.data ?? null,
      }),
      {
        status: err.response?.status ?? 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req: NextRequest)    { return forwardRequest("GET",    req); }
export async function POST(req: NextRequest)   { return forwardRequest("POST",   req); }
export async function PUT(req: NextRequest)    { return forwardRequest("PUT",    req); }
export async function PATCH(req: NextRequest)  { return forwardRequest("PATCH",  req); }
export async function DELETE(req: NextRequest) { return forwardRequest("DELETE", req); }
