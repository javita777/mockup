"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Product, categoryLabels } from "@/lib/mock-data";
import { MoreVertical, Pencil, Trash2, Eye, EyeOff, Coffee, GlassWater, Sandwich, Cake } from "lucide-react";

const categoryIcons: Record<Product["category"], typeof Coffee> = {
  "bebidas-calientes": Coffee,
  "bebidas-frias": GlassWater,
  "comida": Sandwich,
  "postres": Cake,
};

interface MenuListProps {
  products: Product[];
}

export function MenuList({ products }: MenuListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const Icon = categoryIcons[product.category];
        const profit = product.price - product.cost;
        const margin = ((profit / product.price) * 100).toFixed(0);

        return (
          <Card key={product.id} className={!product.active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                    <Badge variant={product.active ? "default" : "secondary"} className="text-xs">
                      {product.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{categoryLabels[product.category]}</span>
                    {product.variants && (
                      <span>{product.variants.length} variantes</span>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="hidden sm:block text-right">
                  <p className="text-lg font-bold text-foreground">${product.price}</p>
                  <p className="text-xs text-muted-foreground">
                    Costo: ${product.cost} ({margin}% margen)
                  </p>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Pencil className="w-4 h-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      {product.active ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Activar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile pricing */}
              <div className="sm:hidden mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-foreground">${product.price}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    (Costo: ${product.cost})
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {margin}% margen
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
