"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authServices, isAuthError } from "@/data/services/auth";
import { SignupFormSchema, SigninFormSchema, type FormState } from "@/data/validation/auth";

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
} as const;

export async function registerUserAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const fields = {
    username: String(formData.get("username") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const validated = SignupFormSchema.safeParse(fields);
  if (!validated.success) {
    const err = z.flattenError(validated.error);
    return { success: false, message: "Validation failed", strapiErrors: null, zodErrors: err.fieldErrors, data: fields };
  }

  const res = await authServices.registerUserService(validated.data);
  if (!res) return { success: false, message: "Network error", strapiErrors: null, zodErrors: null, data: fields };
  if (isAuthError(res)) return { success: false, message: "Failed to Register", strapiErrors: res.error, zodErrors: null, data: fields };

  const cookieStore = await cookies();
  cookieStore.set("jwt", res.jwt, cookieConfig);
  redirect("/dashboard");
}

export async function loginUserAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const fields = {
    identifier: String(formData.get("identifier") || ""),
    password: String(formData.get("password") || ""),
  };

  const validated = SigninFormSchema.safeParse(fields);
  if (!validated.success) {
    const err = z.flattenError(validated.error);
    return { success: false, message: "Validation failed", strapiErrors: null, zodErrors: err.fieldErrors, data: fields };
  }

  const res = await authServices.loginUserService(validated.data);
  if (!res) return { success: false, message: "Network error", strapiErrors: null, zodErrors: null, data: fields };
  if (isAuthError(res)) return { success: false, message: "Failed to Login", strapiErrors: res.error, zodErrors: null, data: fields };

  const cookieStore = await cookies();
  cookieStore.set("jwt", res.jwt, cookieConfig);
  redirect("/dashboard");
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...cookieConfig, maxAge: 0 });
  redirect("/");
}

export async function getAuthTokenAction() {
  const cookieStore = await cookies();
  return cookieStore.get("jwt")?.value;
}


