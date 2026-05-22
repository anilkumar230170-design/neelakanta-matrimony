import { supabase } from "@/integrations/supabase/client";

export const PHOTO_BUCKET = "profile-photos";

/**
 * photo_url in the profiles table stores either:
 *  - a storage path like "<userId>/avatar.jpg" (private bucket), or
 *  - a full http(s) URL (legacy / external), or null.
 * This helper returns a usable image URL for <img src>.
 * Returns null when the viewer is not allowed to see the photo.
 */
export async function resolvePhotoUrl(value?: string | null): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(value, 60 * 60);
  if (error || !data) return null;
  return data.signedUrl;
}

export function photoStoragePath(userId: string, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  return `${userId}/avatar-${Date.now()}.${ext}`;
}
