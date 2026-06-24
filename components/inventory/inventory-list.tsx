"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { InventoryItem } from "@/lib/types";
import { MoreVertical, Plus, Minus, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { IngredientForm } from "./ingredient-form";
import { ReorderDialog } from "./reorder-dialog";
import type { ReorderItem } from "./reorder-dialog";

interface InventoryListProps {
  items: InventoryItem[];
  loading: boolean;
  cafeId: string | null;
  onRefresh: () => void;
}

function getStockStatus(item: InventoryItem) {
  if (item.current_stock <= item.minimum_stock) {
    return { label: "Bajo", color: "bg-danger", textColor: "text-danger" };
  }
  if (item.current_stock <= item.minimum_stock * 2) {
    return { label: "Medio", color: "bg-warning", textColor: "text-warning" };
  }
  return { label: "OK", color: "bg-success", textColor: "text-success" };
}

export function InventoryList({ items, loading, cafeId, onRefresh }: InventoryListProps) {
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);
  const [reorderItem, setReorderItem] = useState<ReorderItem | null>(null);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);

  const adjustStock = async (item: InventoryItem, delta: number) => {
    const newStock = Math.max(0, item.current_stock + delta);
    setAdjustingId(item.id);
    const { error } = await supabase
      .from("inventory_items")
      .update({ current_stock: newStock, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    setAdjustingId(null);
    if (error) {
      toast.error("Error al actualizar el stock");
    } else {
      onRefresh();
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", deleteItem.id);
    setDeleteItem(null);
    if (error) {
      toast.error("No se puede eliminar: el ingrediente está en uso en recetas");
    } else {
      toast.success("Ingrediente eliminado");
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-12 bg-muted animate-pulse rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron ingredientes</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item) => {
          const stockStatus = getStockStatus(item);
          const reference = Math.max(item.minimum_stock * 3, item.current_stock);
          const stockPercentage = Math.min((item.current_stock / reference) * 100, 100);
          const value = item.current_stock * item.unit_cost;
          const isAdjusting = adjustingId === item.id;

          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={cn("w-2 h-12 rounded-full flex-shrink-0", stockStatus.color)} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge variant="outline" className={cn("text-xs", stockStatus.textColor)}>
                        {stockStatus.label}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {item.current_stock} {item.unit} actuales
                        </span>
                        <span className="text-muted-foreground">
                          Mín: {item.minimum_stock} {item.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", stockStatus.color)}
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right">
                    <p className="font-semibold text-foreground">${value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">${item.unit_cost}/{item.unit}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.current_stock <= item.minimum_stock && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs border-warning text-warning hover:bg-warning/10 hover:text-warning hidden sm:flex"
                        onClick={() => setReorderItem(item)}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Reordenar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isAdjusting}
                      onClick={() => adjustStock(item, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isAdjusting}
                      onClick={() => adjustStock(item, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setEditItem(item)}>
                          <Pencil className="w-4 h-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => setDeleteItem(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="sm:hidden mt-3 pt-3 border-t border-border flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Valor en stock:</span>
                  <div className="flex items-center gap-2">
                    {item.current_stock <= item.minimum_stock && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1.5 text-xs border-warning text-warning hover:bg-warning/10 hover:text-warning"
                        onClick={() => setReorderItem(item)}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Reordenar
                      </Button>
                    )}
                    <span className="font-semibold text-foreground">${value.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reorder dialog */}
      <ReorderDialog
        item={reorderItem}
        open={!!reorderItem}
        onOpenChange={(open) => !open && setReorderItem(null)}
      />

      {/* Edit dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Ingrediente</DialogTitle>
          </DialogHeader>
          {editItem && cafeId && (
            <IngredientForm
              cafeId={cafeId}
              initial={editItem}
              onClose={() => setEditItem(null)}
              onSaved={() => { setEditItem(null); onRefresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ingrediente?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <strong>{deleteItem?.name}</strong> del inventario. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
