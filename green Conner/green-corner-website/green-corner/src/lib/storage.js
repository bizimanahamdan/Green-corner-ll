import { supabase } from "./supabaseClient";

// Uploads a file to the "media" bucket and returns its public URL.
// folder e.g. "logo" or "hero" just keeps files organized in storage.
export async function uploadMedia(file, folder = "uploads") {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export const MAX_IMAGE_MB = 5;
export const MAX_VIDEO_MB = 30;
