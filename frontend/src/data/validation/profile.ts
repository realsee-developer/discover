import { z } from "zod";

export const ProfileFormSchema = z.object({
  firstName: z.string().min(1, "请输入名字").max(50, "名字过长").optional().or(z.literal("")),
  lastName: z.string().min(1, "请输入姓氏").max(50, "姓氏过长").optional().or(z.literal("")),
  bio: z.string().max(500, "个人简介不超过 500 字").optional().or(z.literal("")),
});

export const ProfileImageFormSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "必须选择图片")
    .refine((file) => file.size <= 5_000_000, "图片需小于 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "仅支持 JPEG/PNG/WebP"
    ),
});

export type ProfileFormState = {
  success: boolean;
  message: string | null;
  strapiErrors: any | null;
  zodErrors: Record<string, string[] | undefined> | null;
  data: Record<string, string>;
};

export const initialProfileFormState: ProfileFormState = {
  success: false,
  message: null,
  strapiErrors: null,
  zodErrors: null,
  data: {},
};


