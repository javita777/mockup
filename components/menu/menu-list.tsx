"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { MoreVertical, Pencil, Trash2, Eye, EyeOff, Coffee, GlassWater, Sandwich, Cake } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ProductForm } from "./product-form";

const categoryIcons: Record<string, typeof Coffee> = {
  "bebidas-calientes": Coffee,
  "bebidas-frias": GlassWater,
  "comida": Sandwich,
  "postres": Cake,
};

interface MenuListProps {
  products: Product[];
  loading: boolean;
  cafeId: string | null;
  onRefresh: () => void;
}

export function MenuList({ products, loading, cafeId, onRefresh }: MenuListProps) {
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ active: !product.active, updated_at: new Date().toISOString() })
      .eq("id", product.id);
    if (error) {
      toast.error("Error al actualizar el producto");
    } else {
      onRefresh();
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteProduct.id);
    setDeleteProduct(null);
    if (error) {
      toast.error("Error al eliminar el producto");
    } else {
      toast.success("Producto eliminado");
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-14 bg-muted animate-pulse rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {products.map((product) => {
          const Icon = categoryIcons[product.category] ?? Coffee;
          const profit = product.price - product.cost;
          const margin = ((profit / product.price) * 100).toFixed(0);

          return (
            <Card key={product.id} className={!product.active ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                      <Badge variant={product.active ? "default" : "secondary"} className="text-xs">
                        {product.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{CATEGORY_LABELS[product.category] ?? product.category}</span>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right">
                    <p className="text-lg font-bold text-foreground">${product.price}</p>
                    <p className="text-xs text-muted-foreground">
                      Costo: ${product.cost} ({margin}% margen)
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setEditProduct(product)}>
                        <Pencil className="w-4 h-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toggleActive(product)}>
                        {product.active ? (
                          <><EyeOff className="w-4 h-4" /> Desactivar</>
                        ) : (
                          <><Eye className="w-4 h-4" /> Activar</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => setDeleteProduct(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="sm:hidden mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-foreground">${product.price}</span>
                    <span className="text-sm text-muted-foreground ml-2">(Costo: ${product.cost})</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{margin}% margen</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {editProduct && cafeId && (
            <ProductForm
              cafeId={cafeId}
              initial={editProduct}
              onClose={() => setEditProduct(null)}
              onSaved={() => { setEditProduct(null); onRefresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <strong>{deleteProduct?.name}</strong> del menú. Esta acción no se puede deshacer.
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
