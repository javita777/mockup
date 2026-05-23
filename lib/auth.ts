import { supabase } from "./supabase";

const SESSION_KEY = "activeCafeteria";

export interface SessionUser {
  id: string;
  username: string;
  name: string;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export { toSlug };

export const auth = {
  login: async (
    username: string,
    password: string
  ): Promise<{ success: boolean; user?: SessionUser; error?: string }> => {
    const { data } = await supabase
      .from("cafes")
      .select("id, name, slug")
      .eq("slug", username.toLowerCase().trim())
      .eq("password", password)
      .single();

    if (!data) {
      return { success: false, error: "Usuario o contraseña incorrectos" };
    }

    const userData: SessionUser = { id: data.id, username: data.slug, name: data.name };

    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      window.dispatchEvent(new CustomEvent("auth-changed", { detail: userData }));
    }
    return { success: true, user: userData };
  },

  register: async (
    cafeName: string,
    slug: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { data: existing } = await supabase
      .from("cafes")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Ese usuario ya está en uso, elige otro" };
    }

    const { data, error } = await supabase
      .from("cafes")
      .insert({ name: cafeName, slug, password })
      .select("id, name, slug")
      .single();

    if (error || !data) {
      return { success: false, error: "Error al crear la cuenta" };
    }

    const userData: SessionUser = { id: data.id, username: data.slug, name: data.name };

    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      window.dispatchEvent(new CustomEvent("auth-changed", { detail: userData }));
    }
    return { success: true };
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new CustomEvent("auth-changed", { detail: null }));
    }
  },

  getActiveUser: (): SessionUser | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },
};
