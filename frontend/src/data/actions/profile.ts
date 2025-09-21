"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileFormSchema, ProfileImageFormSchema, type ProfileFormState, initialProfileFormState } from "@/data/validation/profile";
import { deleteFileService, getMeService, updateProfileService, uploadFileService } from "@/data/services/profile";

const cookieName = "jwt";

export async function updateProfileAction(prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(cookieName)?.value;
  if (!jwt) return { ...initialProfileFormState, message: "未登录", success: false };

  const fields = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    bio: String(formData.get("bio") ?? ""),
  };

  const parsed = ProfileFormSchema.safeParse(fields);
  if (!parsed.success) {
    const err = z.flattenError(parsed.error);
    return { success: false, message: "校验失败", strapiErrors: null, zodErrors: err.fieldErrors, data: fields };
  }

  const res = await updateProfileService(jwt, parsed.data);
  if (!res) return { success: false, message: "网络错误", strapiErrors: null, zodErrors: null, data: fields };
  if ("error" in res) return { success: false, message: "更新失败", strapiErrors: res.error, zodErrors: null, data: fields };

  return { success: true, message: "更新成功", strapiErrors: null, zodErrors: null, data: fields };
}

export async function updateProfileImageAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(cookieName)?.value;
  if (!jwt) return { ...initialProfileFormState, message: "未登录", success: false };

  const file = formData.get("image");
  const parsed = ProfileImageFormSchema.safeParse({ image: file });
  if (!parsed.success) {
    const err = z.flattenError(parsed.error);
    return { success: false, message: "图片校验失败", strapiErrors: null, zodErrors: err.fieldErrors, data: {} };
  }

  const me = await getMeService(jwt);
  const oldFileId = me?.avatar?.id as number | undefined;

  if (oldFileId) {
    await deleteFileService(jwt, oldFileId).catch(() => {});
  }

  const uploaded = await uploadFileService(jwt, parsed.data.image);
  if (!uploaded || Array.isArray(uploaded) === false) {
    return { success: false, message: "上传失败", strapiErrors: null, zodErrors: null, data: {} };
  }

  const fileData = uploaded[0];
  const linkRes = await updateProfileService(jwt, { avatar: fileData.id });
  if (!linkRes || ("error" in linkRes)) {
    return { success: false, message: "头像更新失败", strapiErrors: (linkRes as any)?.error ?? null, zodErrors: null, data: {} };
  }

  return { success: true, message: "头像已更新", strapiErrors: null, zodErrors: null, data: {} };
}

export async function logoutAndRedirectAction() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, "", { path: "/", maxAge: 0 });
  redirect("/");
}


