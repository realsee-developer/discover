import { z } from "zod";

export const SignupFormSchema = z.object({
  username: z.string().min(2, "用户名至少 2 个字符"),
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
});

export const SigninFormSchema = z.object({
  identifier: z.string().min(2, "请输入用户名或邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
});

export type FormState = {
  success: boolean;
  message: string | null;
  strapiErrors: any | null;
  zodErrors: Record<string, string[] | undefined> | null;
  data: Record<string, string>;
};

export const initialFormState: FormState = {
  success: false,
  message: null,
  strapiErrors: null,
  zodErrors: null,
  data: {},
};


