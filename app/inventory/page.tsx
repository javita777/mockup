"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { InventoryList } from "@/components/inventory/inventory-list";
import { InventoryStats } from "@/components/inventory/inventory-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download } from "lucide-react";
import { ingredients } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IngredientForm } from "@/components/inventory/ingredient-form";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "low" | "ok">("all");

  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    
    const stockPercentage = (ingredient.currentStock / ingredient.maxStock) * 100;
    const isLow = ingredient.currentStock <= ingredient.minStock;
    const isMedium = stockPercentage <= 40 && !isLow;
    
    if (statusFilter === "low") return matchesSearch && (isLow || isMedium);
    if (statusFilter === "ok") return matchesSearch && !isLow && !isMedium;
    
    return matchesSearch;
  });

  return (
    <AppShell>
      <PageHeader title="Inventario" description="Control de stock e ingredientes">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
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
              <IngredientForm onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <InventoryStats ingredients={ingredients} />

        {/* Search and filters */}
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
            {(["all", "low", "ok"] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" && "Todos"}
                {status === "low" && "Stock Bajo"}
                {status === "ok" && "OK"}
              </Button>
            ))}
          </div>
        </div>

        {/* Inventory List */}
        <InventoryList ingredients={filteredIngredients} />
      </div>
    </AppShell>
  );
}
