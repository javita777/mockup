"use client";

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { MenuList } from "@/components/menu/menu-list";
import { MenuFilters } from "@/components/menu/menu-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/menu/product-form";
import { supabase } from "@/lib/supabase";
import { useCafe } from "@/context/cafe-context";
import type { Product } from "@/lib/types";

export default function MenuPage() {
  const { cafeId } = useCafe();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!cafeId) return;
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("cafe_id", cafeId)
      .order("name");
    setProducts(data ?? []);
    setLoading(false);
  }, [cafeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesStatus = showInactive || p.active;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.active).length,
    inactive: products.filter((p) => !p.active).length,
  };

  return (
    <AppShell>
      <PageHeader title="Menú" description="Gestiona tus productos y precios">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Producto</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo Producto</DialogTitle>
            </DialogHeader>
            {cafeId && (
              <ProductForm
                cafeId={cafeId}
                onClose={() => setDialogOpen(false)}
                onSaved={() => { setDialogOpen(false); fetchProducts(); }}
              />
            )}
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-foreground">{loading ? "…" : stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-success">{loading ? "…" : stats.active}</p>
            <p className="text-sm text-muted-foreground">Activos</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-muted-foreground">{loading ? "…" : stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactivos</p>
          </div>
        </div>

        <MenuFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          showInactive={showInactive}
          onShowInactiveChange={setShowInactive}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={[
            { id: "all", name: "Todos" },
            ...CATEGORIES,
          ]}
        />

        <MenuList
          products={filteredProducts}
          loading={loading}
          cafeId={cafeId}
          onRefresh={fetchProducts}
        />
      </div>
    </AppShell>
  );
}
