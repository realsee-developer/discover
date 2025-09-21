import { getStrapiURL } from "@/lib/utils";

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

type LoginPayload = {
  identifier: string; // username or email
  password: string;
};

type StrapiAuthSuccess = {
  jwt: string;
  user: Record<string, unknown>;
};

type StrapiError = {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

export function isAuthError(res: unknown): res is StrapiError {
  return typeof res === "object" && res !== null && "error" in res;
}

async function postJSON<TReq extends object, TRes = unknown>(path: string, body: TReq): Promise<TRes | null> {
  const baseUrl = getStrapiURL();
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = (await res.json()) as TRes;
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }
}

export async function registerUserService(payload: RegisterPayload): Promise<StrapiAuthSuccess | StrapiError | null> {
  return postJSON<RegisterPayload, StrapiAuthSuccess | StrapiError>("/api/auth/local/register", payload);
}

export async function loginUserService(payload: LoginPayload): Promise<StrapiAuthSuccess | StrapiError | null> {
  return postJSON<LoginPayload, StrapiAuthSuccess | StrapiError>("/api/auth/local", payload);
}

export const authServices = {
  registerUserService,
  loginUserService,
  isAuthError,
};


