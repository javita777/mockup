"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Product } from "@/lib/mock-data";
import { Plus, Coffee, Sandwich, Cake, GlassWater } from "lucide-react";
import type { CartItem } from "@/app/pos/page";
import { cn } from "@/lib/utils";

const categoryIcons: Record<Product["category"], typeof Coffee> = {
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedCustomizations, setSelectedCustomizations] = useState<CartItem["customizations"]>([]);

  const handleProductClick = (product: Product) => {
    if (product.variants || product.customizations) {
      setSelectedProduct(product);
      setSelectedVariant(product.variants?.[1]?.name || product.variants?.[0]?.name || "");
      setSelectedCustomizations([]);
    } else {
      onAddToCart(product);
    }
  };

  const handleAddWithOptions = () => {
    if (selectedProduct) {
      onAddToCart(
        selectedProduct,
        selectedVariant || undefined,
        selectedCustomizations.length > 0 ? selectedCustomizations : undefined
      );
      setSelectedProduct(null);
    }
  };

  const toggleCustomization = (groupName: string, optionName: string, price: number) => {
    setSelectedCustomizations((prev) => {
      const existing = prev.find((c) => c.name === groupName);
      if (existing) {
        if (existing.option === optionName) {
          return prev.filter((c) => c.name !== groupName);
        }
        return prev.map((c) =>
          c.name === groupName ? { name: groupName, option: optionName, price } : c
        );
      }
      return [...prev, { name: groupName, option: optionName, price }];
    });
  };

  const calculatePrice = () => {
    if (!selectedProduct) return 0;
    let price = selectedProduct.price;
    
    if (selectedVariant && selectedProduct.variants) {
      const variant = selectedProduct.variants.find((v) => v.name === selectedVariant);
      if (variant) price += variant.priceModifier;
    }
    
    selectedCustomizations.forEach((c) => {
      price += c.price;
    });
    
    return price;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {products.map((product) => {
          const Icon = categoryIcons[product.category];
          return (
            <Card
              key={product.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
              onClick={() => handleProductClick(product)}
            >
              <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <Icon className="w-12 h-12 text-primary/60" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-primary">
                    ${product.price}
                  </span>
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Product Options Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Variants */}
            {selectedProduct?.variants && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Tamaño</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants.map((variant) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant.name)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                        selectedVariant === variant.name
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:border-primary/50"
                      )}
                    >
                      {variant.name}
                      {variant.priceModifier !== 0 && (
                        <span className="ml-1 opacity-70">
                          {variant.priceModifier > 0 ? "+" : ""}${variant.priceModifier}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customizations */}
            {selectedProduct?.customizations?.map((group) => (
              <div key={group.name}>
                <h4 className="text-sm font-semibold text-foreground mb-3">{group.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const isSelected = selectedCustomizations.some(
                      (c) => c.name === group.name && c.option === option.name
                    );
                    return (
                      <button
                        key={option.name}
                        onClick={() => toggleCustomization(group.name, option.name, option.price)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-secondary-foreground hover:border-primary/50"
                        )}
                      >
                        {option.name}
                        {option.price > 0 && (
                          <span className="ml-1 opacity-70">+${option.price}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Selected options summary */}
            {selectedCustomizations.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedCustomizations.map((c) => (
                  <Badge key={c.name} variant="secondary" className="text-xs">
                    {c.option}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">${calculatePrice()}</p>
            </div>
            <Button size="lg" onClick={handleAddWithOptions} className="px-8">
              Agregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
