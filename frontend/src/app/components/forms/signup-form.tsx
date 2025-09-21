"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { initialFormState } from "@/data/validation/auth";
import { registerUserAction } from "@/data/actions/auth";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(registerUserAction, initialFormState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">用户名</label>
        <input
          name="username"
          type="text"
          placeholder="yourname"
          className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
          defaultValue={state.data.username}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">邮箱</label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
          defaultValue={state.data.email}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">密码</label>
        <input
          name="password"
          type="password"
          placeholder="••••••"
          className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
          required
        />
      </div>

      {state.message && <div className="text-sm text-red-600">{state.message}</div>}
      {state.zodErrors && (
        <div className="text-sm text-red-600 space-y-1">
          {Object.values(state.zodErrors).filter(Boolean).map((errs, idx) => (
            <div key={idx}>{(errs || []).join(", ")}</div>
          ))}
        </div>
      )}
      {state.strapiErrors?.message && (
        <div className="text-sm text-red-600">{state.strapiErrors.message}</div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "注册中..." : "注册"}
      </Button>

      <p className="text-center text-sm">
        已有账号？
        <Link href="/signin" className="ml-2 underline">去登录</Link>
      </p>
    </form>
  );
}

export default SignupForm;


