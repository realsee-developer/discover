"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { initialFormState } from "@/data/validation/auth";
import { loginUserAction } from "@/data/actions/auth";

export function SigninForm() {
  const [state, formAction, pending] = useActionState(loginUserAction, initialFormState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">用户名或邮箱</label>
        <input
          name="identifier"
          type="text"
          placeholder="yourname or you@example.com"
          className="mt-1 w-full border rounded px-3 py-2 bg-transparent"
          defaultValue={state.data.identifier}
          required
        />
        {state.zodErrors?.identifier && (
          <div className="mt-1 text-sm text-red-600">{state.zodErrors.identifier.join(", ")}</div>
        )}
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
        {state.zodErrors?.password && (
          <div className="mt-1 text-sm text-red-600">{state.zodErrors.password.join(", ")}</div>
        )}
      </div>

      {state.message && <div className="text-sm text-red-600">{state.message}</div>}
      {state.strapiErrors?.message && (
        <div className="text-sm text-red-600">{state.strapiErrors.message}</div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "登录中..." : "登录"}
      </Button>

      <p className="text-center text-sm">
        还没有账号？
        <Link href="/signup" className="ml-2 underline">去注册</Link>
      </p>
    </form>
  );
}

export default SigninForm;


