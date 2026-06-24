"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Package, ShoppingCart, Store } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ReorderItem {
  id: string;
  name: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  unit_cost: number;
  supplier?: string | null;
}

interface ReorderDialogProps {
  item: ReorderItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReorderDialog({ item, open, onOpenChange }: ReorderDialogProps) {
  const suggestedQty = item
    ? Math.max(item.minimum_stock * 3 - item.current_stock, item.minimum_stock)
    : 0;

  const [quantity, setQuantity] = useState<string>("");
  const [sending, setSending] = useState(false);

  const qty = parseFloat(quantity) || suggestedQty;
  const estimatedCost = item ? qty * item.unit_cost : 0;

  const handleOpen = (open: boolean) => {
    if (open) setQuantity(suggestedQty.toString());
    onOpenChange(open);
  };

  const handleConfirm = async () => {
    if (!item) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    onOpenChange(false);
    toast.success(
      item.supplier
        ? `Pedido enviado a ${item.supplier}: ${qty} ${item.unit} de ${item.name}`
        : `Pedido registrado: ${qty} ${item.unit} de ${item.name}`
    );
  };

  if (!item) return null;

  const hasSupplier = !!item.supplier;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Reordenar al Proveedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item info */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="font-semibold">{item.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground pl-6">
              <span>Stock actual: <strong className="text-foreground">{item.current_stock} {item.unit}</strong></span>
              <span>Mínimo: <strong className="text-foreground">{item.minimum_stock} {item.unit}</strong></span>
            </div>
          </div>

          {/* Supplier */}
          <div className={cn(
            "flex items-center gap-2 p-3 rounded-lg border",
            hasSupplier ? "border-border bg-background" : "border-warning/40 bg-warning/10"
          )}>
            <Store className={cn("w-4 h-4 shrink-0", hasSupplier ? "text-muted-foreground" : "text-warning")} />
            {hasSupplier ? (
              <span className="text-sm">Proveedor: <strong>{item.supplier}</strong></span>
            ) : (
              <div className="text-sm">
                <p className="font-medium text-warning flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Sin proveedor asignado
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Edita el ingrediente para agregar un proveedor
                </p>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="reorder-qty">
              Cantidad a pedir <span className="text-muted-foreground font-normal">({item.unit})</span>
            </Label>
            <Input
              id="reorder-qty"
              type="number"
              step="0.01"
              min="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Sugerido: {suggestedQty} {item.unit} para alcanzar 3× el mínimo
            </p>
          </div>

          {/* Cost estimate */}
          <div className="p-3 rounded-lg bg-muted text-sm flex justify-between">
            <span className="text-muted-foreground">Costo estimado del pedido</span>
            <span className="font-semibold">${estimatedCost.toLocaleString("es-CL")}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={sending || qty <= 0} className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            {sending ? "Enviando..." : "Confirmar Pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
