import Image from "next/image";
import { cookies } from "next/headers";
import { getStrapiMedia } from "@/lib/utils";
import { getMeService } from "@/data/services/profile";
import { initialProfileFormState } from "@/data/validation/profile";
import { updateProfileAction, updateProfileImageAction } from "@/data/actions/profile";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value ?? "";
  const me = jwt ? await getMeService(jwt) : null;
  const avatarUrl = getStrapiMedia(me?.avatar?.url ?? null);

  async function updateProfile(formData: FormData) {
    "use server";
    await updateProfileAction(initialProfileFormState, formData);
  }

  async function updateProfileImage(formData: FormData) {
    "use server";
    await updateProfileImageAction(initialProfileFormState, formData);
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
      <section className="col-span-3 space-y-4">
        <h2 className="text-xl font-semibold">资料</h2>
        <form action={updateProfile} className="space-y-3">
          <input name="firstName" defaultValue={me?.firstName ?? ""} placeholder="名字" className="w-full border rounded p-2" />
          <input name="lastName" defaultValue={me?.lastName ?? ""} placeholder="姓氏" className="w-full border rounded p-2" />
          <textarea name="bio" defaultValue={me?.bio ?? ""} placeholder="个人简介" className="w-full border rounded p-2 h-28" />
          <SubmitButton>保存</SubmitButton>
        </form>
      </section>

      <section className="col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">头像</h2>
        <div className="h-48 w-full rounded-lg border flex items-center justify-center overflow-hidden bg-gray-50">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="avatar" width={320} height={192} className="object-cover h-full w-full" />
          ) : (
            <span className="text-gray-400">无头像</span>
          )}
        </div>
        <form action={updateProfileImage} className="space-y-3">
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="w-full" />
          <SubmitButton>上传新头像</SubmitButton>
        </form>
      </section>
    </div>
  );
}

function SubmitButton({ children }: { readonly children: React.ReactNode }) {
  return (
    <button type="submit" className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
      {children}
    </button>
  );
}


