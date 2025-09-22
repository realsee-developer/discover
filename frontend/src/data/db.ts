import type { TCarouselEntry, TPhotographer, TVr, TVrTag, TVrTagMap, TVrDevice } from "@/types";
import vrJson from "@/data/vr.json";
import photographersJson from "@/data/photographers.json";
import carouselsJson from "@/data/carousels.json";
import vrTagsJson from "@/data/vr-tags.json";
import vrDevicesJson from "@/data/vr-devices.json";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

let cached: {
  vrs?: Map<string, TVr>;
  tags?: TVrTag[];
  tagMap?: TVrTagMap[];
} = {};

function loadVrs(): TVr[] {
  return vrJson as unknown as TVr[];
}

function buildVrIndex(): Map<string, TVr> {
  if (cached.vrs) return cached.vrs;
  const map = new Map<string, TVr>();
  for (const v of loadVrs()) map.set(v.id, v);
  cached.vrs = map;
  return map;
}

function loadPhotographers(): TPhotographer[] {
  return photographersJson as unknown as TPhotographer[];
}

function loadCarousels(): TCarouselEntry[] {
  const arr = carouselsJson as unknown as { vrId: string; order?: number; imagePath?: string | null; assetPath?: string | null }[];
  return arr
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({
      vrId: c.vrId,
      order: c.order,
      imagePath: c.imagePath ?? null,
      assetPath: c.assetPath ?? null,
    }));
}

function loadTags(): TVrTag[] {
  const tags = (vrTagsJson as unknown as TVrTag[]) ?? [];
  if (tags.length) return tags;
  // Fallback: derive from VRs
  const out: TVrTag[] = [];
  const seen = new Set<string>();
  for (const v of loadVrs()) {
    if (v.category) {
      const sid = `category:${slugify(v.shortCategory || String(v.category))}`;
      if (!seen.has(sid)) {
        seen.add(sid);
        out.push({ id: sid, type: "category", label: v.category });
      }
    }
    if (v.device) {
      const sid = `device:${slugify(v.device)}`;
      if (!seen.has(sid)) {
        seen.add(sid);
        out.push({ id: sid, type: "device", label: v.device });
      }
    }
  }
  return out;
}

function loadDevices(): TVrDevice[] {
  const fromFile = (vrDevicesJson as unknown as TVrDevice[]) ?? [];
  if (fromFile.length) return fromFile;
  // Derive from VRs as fallback
  const derived: TVrDevice[] = [];
  const seen = new Set<string>();
  for (const v of loadVrs()) {
    if (v.device) {
      const id = slugify(v.device);
      if (!seen.has(id)) {
        seen.add(id);
        derived.push({ id, name: v.device });
      }
    }
  }
  return derived;
}

export function getVrs(): TVr[] {
  return loadVrs();
}

export function getVrById(id: string): TVr | undefined {
  return buildVrIndex().get(id);
}

export function getVrTags(): TVrTag[] {
  if (cached.tags) return cached.tags;
  cached.tags = loadTags();
  return cached.tags;
}

export function getVrTagMap(): TVrTagMap[] {
  if (cached.tagMap) return cached.tagMap;
  const tags = getVrTags();
  const vrs = loadVrs();
  const tagIndex = new Set(tags.map((t) => t.id));
  const map: TVrTagMap[] = [];
  for (const v of vrs) {
    if (v.category) {
      const tid = `category:${slugify(v.shortCategory || String(v.category))}`;
      if (tagIndex.has(tid)) map.push({ vrId: v.id, tagId: tid });
    }
    if (v.device) {
      const tid = `device:${slugify(v.device)}`;
      if (tagIndex.has(tid)) map.push({ vrId: v.id, tagId: tid });
    }
  }
  cached.tagMap = map;
  return map;
}

export function getTourVrIds(): string[] {
  return loadVrs().map((t) => t.id);
}

export function getPhotographers(): TPhotographer[] {
  return loadPhotographers();
}

export function getCarousels(): TCarouselEntry[] {
  return loadCarousels();
}

export function getDevices(): TVrDevice[] {
  return loadDevices();
}

export function clearCache(): void {
  cached = {};
}

export function resolvePublicAssetPath(input?: string | null): string | undefined {
  if (!input) return undefined;
  if (input.startsWith("@cover/")) return `/cover/${input.slice(7)}`;
  if (input.startsWith("@carousel/")) return `/carousel/${input.slice(10)}`;
  return input;
}


