"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type PlanoId = "trial" | "mensal" | "mensal_plus" | "anual" | null;

export function usePlano() {
  const [plano, setPlano] = useState<PlanoId>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plano")
        .eq("user_id", user.id)
        .eq("status", "ativa")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      setPlano((sub?.plano as PlanoId) ?? "trial");
      setLoading(false);
    }
    load();
  }, []);

  return { plano, loading };
}
