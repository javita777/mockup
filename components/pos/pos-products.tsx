"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Coffee, Sandwich, Cake, GlassWater } from "lucide-react";
import type { Product } from "@/lib/types";
import type { CartItem } from "@/app/pos/page";

const categoryIcons: Record<string, typeof Coffee> = {
  "bebidas-calientes": Coffee,
  "bebidas-frias": GlassWater,
  "comida": Sandwich,
  "postres": Cake,
};

interface POSProductsProps {
  products: Product[];
  onAddToCart: (product: Product, variant?: string, customizations?: CartItem["customizations"]) => void;
}

export function POSProducts({ products, onAddToCart }: POSProductsProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-muted-foreground">No hay productos en esta categoría</p>
        <p className="text-sm text-muted-foreground mt-1">Agrega productos desde la sección Menú</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map((product) => {
        const Icon = categoryIcons[product.category] ?? Coffee;
        return (
          <Card
            key={product.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
            onClick={() => onAddToCart(product)}
          >
            <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <Icon className="w-12 h-12 text-primary/60" />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-primary">${product.price}</span>
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
