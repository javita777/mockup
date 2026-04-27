"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from "lucide-react";
import type { CartItem } from "@/app/pos/page";

interface POSCartProps {
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  total: number;
}

export function POSCart({ cart, onUpdateQuantity, onRemove, onClear, total }: POSCartProps) {
  const tax = total * 0.16;
  const grandTotal = total + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Carrito</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">El carrito está vacío</p>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona productos para agregar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Carrito
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
          </span>
        </h2>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-1" />
          Limpiar
        </Button>
      </div>

      {/* Items */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.variant}-${index}`}
              className="flex gap-3 p-3 bg-secondary/50 rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-sm text-foreground">
                      {item.product.name}
                    </h3>
                    {item.variant && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.variant}
                      </Badge>
                    )}
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.customizations.map((c) => (
                          <span key={c.name} className="text-xs text-muted-foreground">
                            + {c.option}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(index, -1)}
                      className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(index, 1)}
                      className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-foreground">
                    ${item.totalPrice.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-4 bg-card">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">IVA (16%)</span>
            <span className="text-foreground">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-primary">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <Button size="lg" className="w-full gap-2 h-14 text-base">
          <CreditCard className="w-5 h-5" />
          Cobrar ${grandTotal.toFixed(0)}
        </Button>
      </div>
    </div>
  );
}
