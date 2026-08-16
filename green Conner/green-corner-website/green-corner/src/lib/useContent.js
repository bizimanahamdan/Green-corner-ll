import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  businessInfo as demoBusinessInfo,
  hours as demoHours,
  galleryImages as demoGallery,
  menuCategories as demoMenu,
  specials as demoSpecials,
  reviews as demoReviews
} from "./demoData";

function useLive(fetcher, fallback, deps = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [usingLiveData, setUsingLiveData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured) {
      setData(fallback);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetcher()
      .then((result) => {
        if (cancelled) return;
        if (result && (!Array.isArray(result) || result.length > 0)) {
          setData(result);
          setUsingLiveData(true);
        } else {
          setData(fallback);
        }
      })
      .catch(() => {
        if (!cancelled) setData(fallback);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, usingLiveData };
}

// Supabase returns snake_case columns; the app uses camelCase everywhere else.
function normalizeBusinessInfo(row) {
  if (!row) return row;
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    phone: row.phone,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    facebookUrl: row.facebook_url,
    tiktokUrl: row.tiktok_url,
    neighborhood: row.neighborhood,
    city: row.city,
    priceRange: row.price_range,
    googleRating: row.google_rating,
    googleReviewCount: row.google_review_count,
    serviceOptions: row.service_options || demoBusinessInfo.serviceOptions,
    mapsQuery: row.maps_query,
    logoUrl: row.logo_url,
    heroMediaType: row.hero_media_type || "images",
    heroVideoUrl: row.hero_video_url,
    heroImage1: row.hero_image_1 || demoBusinessInfo.heroImage1,
    heroImage2: row.hero_image_2 || demoBusinessInfo.heroImage2,
    heroImage3: row.hero_image_3 || demoBusinessInfo.heroImage3
  };
}

export function useBusinessInfo() {
  return useLive(
    async () => {
      const { data, error } = await supabase.from("business_info").select("*").single();
      if (error) throw error;
      return normalizeBusinessInfo(data);
    },
    demoBusinessInfo
  );
}

export function useHours() {
  return useLive(
    async () => {
      const { data, error } = await supabase.from("hours").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
    demoHours
  );
}

export function useGallery() {
  return useLive(
    async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
    demoGallery
  );
}

export function useSpecials() {
  return useLive(
    async () => {
      const { data, error } = await supabase.from("specials").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      // Normalize db's image_url to the "image" field the UI expects (matches demo data shape).
      return data.map((s) => ({ ...s, image: s.image_url }));
    },
    demoSpecials
  );
}

export function useReviews() {
  return useLive(
    async () => {
      const { data, error } = await supabase.from("reviews").select("*").eq("visible", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    demoReviews
  );
}

export function useMenu() {
  return useLive(
    async () => {
      const { data: categories, error: catError } = await supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order");
      if (catError) throw catError;
      const { data: items, error: itemError } = await supabase
        .from("menu_items")
        .select("*")
        .order("sort_order");
      if (itemError) throw itemError;
      // Normalize db snake_case columns to the same shape the demo data uses
      // (image, specialty, available) so every page that consumes menu items
      // works the same whether it's reading live or demo data.
      const normalizedItems = items.map((item) => ({
        ...item,
        image: item.image_url,
        specialty: item.is_specialty,
        available: item.is_available
      }));
      return categories.map((cat) => ({
        ...cat,
        items: normalizedItems.filter((item) => item.category_id === cat.id)
      }));
    },
    demoMenu
  );
}
