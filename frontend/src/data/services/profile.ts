import { getStrapiURL } from "@/lib/utils";

type StrapiError = {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

export async function getMeService(jwt: string) {
  const base = getStrapiURL();
  const res = await fetch(`${base}/api/users/me?populate=avatar`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as any;
}

export async function updateProfileService(jwt: string, payload: Record<string, any>) {
  const base = getStrapiURL();
  const res = await fetch(`${base}/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(payload),
  });
  try {
    const json = await res.json();
    return json as any | StrapiError;
  } catch {
    return null;
  }
}

export async function uploadFileService(jwt: string, file: File) {
  const base = getStrapiURL();
  const form = new FormData();
  form.append("files", file);
  const res = await fetch(`${base}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  });
  try {
    const json = await res.json();
    return json as any[] | StrapiError;
  } catch {
    return null;
  }
}

export async function deleteFileService(jwt: string, fileId: number) {
  const base = getStrapiURL();
  const res = await fetch(`${base}/api/upload/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) return null;
  try {
    return (await res.json()) as any;
  } catch {
    return null;
  }
}


