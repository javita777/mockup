"use client";

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { InventoryList } from "@/components/inventory/inventory-list";
import { InventoryStats } from "@/components/inventory/inventory-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IngredientForm } from "@/components/inventory/ingredient-form";
import { supabase } from "@/lib/supabase";
import { useCafe } from "@/context/cafe-context";
import type { InventoryItem } from "@/lib/types";

export default function InventoryPage() {
  const { cafeId, cafeLoading } = useCafe();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "low" | "ok">("all");

  const fetchItems = useCallback(async () => {
    if (!cafeId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("cafe_id", cafeId)
      .order("name");
    setItems(data ?? []);
    setLoading(false);
  }, [cafeId]);

  useEffect(() => {
    if (!cafeLoading) fetchItems();
  }, [fetchItems, cafeLoading]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    const isLow = item.current_stock <= item.minimum_stock;
    if (statusFilter === "low") return matchesSearch && isLow;
    if (statusFilter === "ok") return matchesSearch && !isLow;
    return matchesSearch;
  });

  return (
    <AppShell>
      <PageHeader title="Inventario" description="Control de stock e ingredientes">
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Agregar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nuevo Ingrediente</DialogTitle>
              </DialogHeader>
              {cafeId && (
                <IngredientForm
                  cafeId={cafeId}
                  onClose={() => setDialogOpen(false)}
                  onSaved={() => { setDialogOpen(false); fetchItems(); }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        <InventoryStats items={filteredItems} loading={loading} />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ingredientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "low", "ok"] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" && "Todos"}
                {s === "low" && "Stock Bajo"}
                {s === "ok" && "OK"}
              </Button>
            ))}
          </div>
        </div>

        <InventoryList
          items={filteredItems}
          loading={loading}
          cafeId={cafeId}
          onRefresh={fetchItems}
        />
      </div>
    </AppShell>
  );
}
