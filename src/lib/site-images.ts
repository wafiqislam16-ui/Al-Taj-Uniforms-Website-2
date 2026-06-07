import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Site images stored in the `site_content` table under the row keyed
 * `site_images`. Value is a JSON object of `{ [slot]: url }`.
 *
 * To make a new image manageable from the admin panel, add a slot here
 * and reference it via `useSiteImage(slot, fallback)` in the page.
 */
export const IMAGE_SLOTS = [
  { key: "home.schools",       label: "Homepage — Schools section",      page: "Homepage" },
  { key: "home.embroidery",    label: "Homepage — Embroidery section",   page: "Homepage" },
  { key: "about.banner",       label: "About — Banner image",            page: "About" },
  { key: "about.manufacturing",label: "About — Manufacturing image",     page: "About" },
  { key: "schools.banner",     label: "Schools — Banner image",          page: "Schools & Institutions" },
  { key: "embroidery.banner",  label: "Embroidery — Banner image",       page: "Embroidery & Branding" },
  { key: "contact.banner",     label: "Contact — Header image",          page: "Contact" },
] as const;

export type ImageSlot = (typeof IMAGE_SLOTS)[number]["key"];

const CACHE_KEY = "site_images";
let cache: Record<string, string> | null = null;
let inflight: Promise<Record<string, string>> | null = null;
const listeners = new Set<(v: Record<string, string>) => void>();

async function fetchAll(): Promise<Record<string, string>> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", CACHE_KEY)
      .maybeSingle();
    const value = (data?.value && typeof data.value === "object") ? (data.value as Record<string, string>) : {};
    cache = value;
    listeners.forEach((l) => l(value));
    return value;
  })();
  return inflight;
}

export function invalidateSiteImages() {
  cache = null;
  inflight = null;
}

/** Read a single managed image, falling back to a bundled default. */
export function useSiteImage(slot: ImageSlot, fallback: string): string {
  const [url, setUrl] = useState<string>(cache?.[slot] ?? fallback);
  useEffect(() => {
    let active = true;
    fetchAll().then((all) => {
      if (active && all[slot]) setUrl(all[slot]);
    });
    const onChange = (all: Record<string, string>) => {
      if (active) setUrl(all[slot] ?? fallback);
    };
    listeners.add(onChange);
    return () => { active = false; listeners.delete(onChange); };
  }, [slot, fallback]);
  return url;
}

/** Admin helper: read the full map (no fallbacks). */
export function useAllSiteImages(): [Record<string, string>, (v: Record<string, string>) => void] {
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    fetchAll().then(setMap);
  }, []);
  return [map, (v) => { cache = v; setMap(v); listeners.forEach((l) => l(v)); }];
}

/** Save the full map back to Supabase. */
export async function saveSiteImages(value: Record<string, string>) {
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: CACHE_KEY, value }, { onConflict: "key" });
  if (error) throw error;
  cache = value;
  listeners.forEach((l) => l(value));
}
