"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

interface CafeContextValue {
  cafeId: string | null;
  cafeName: string | null;
  cafeLoading: boolean;
}

const CafeContext = createContext<CafeContextValue>({
  cafeId: null,
  cafeName: null,
  cafeLoading: true,
});

export function CafeProvider({ children }: { children: React.ReactNode }) {
  const [cafeId, setCafeId] = useState<string | null>(null);
  const [cafeName, setCafeName] = useState<string | null>(null);
  const [cafeLoading, setCafeLoading] = useState(true);

  const loadCafe = useCallback(async () => {
    setCafeLoading(true);
    const user = auth.getActiveUser();
    if (!user) {
      setCafeId(null);
      setCafeName(null);
      setCafeLoading(false);
      return;
    }

    const { data } = await supabase
      .from("cafes")
      .select("id, name")
      .eq("slug", user.username)
      .single();

    if (data) {
      setCafeId(data.id);
      setCafeName(data.name);
    } else {
      setCafeId(null);
      setCafeName(null);
    }
    setCafeLoading(false);
  }, []);

  useEffect(() => {
    loadCafe();
    window.addEventListener("auth-changed", loadCafe);
    return () => window.removeEventListener("auth-changed", loadCafe);
  }, [loadCafe]);

  return (
    <CafeContext.Provider value={{ cafeId, cafeName, cafeLoading }}>
      {children}
    </CafeContext.Provider>
  );
}

export const useCafe = () => useContext(CafeContext);
