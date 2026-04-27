"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { MenuList } from "@/components/menu/menu-list";
import { MenuFilters } from "@/components/menu/menu-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { products, categoryLabels } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/menu/product-form";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesStatus = showInactive || product.active;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Producto</DialogTitle>
            </DialogHeader>
            <ProductForm onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-success">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Activos</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactivos</p>
          </div>
        </div>

        {/* Filters */}
        <MenuFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          showInactive={showInactive}
          onShowInactiveChange={setShowInactive}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={[
            { id: "all", name: "Todos" },
            ...Object.entries(categoryLabels).map(([id, name]) => ({ id, name })),
          ]}
        />

        {/* Products List */}
        <MenuList products={filteredProducts} />
      </div>
    </AppShell>
  );
}
