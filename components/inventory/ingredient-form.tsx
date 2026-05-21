"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { UNITS } from "@/lib/types";
import { toast } from "sonner";

interface IngredientFormProps {
  cafeId: string;
  onClose: () => void;
  onSaved: () => void;
  initial?: {
    id: string;
    name: string;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    unit_cost: number;
    supplier?: string | null;
  };
}

export function IngredientForm({ cafeId, onClose, onSaved, initial }: IngredientFormProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: initial?.name ?? "",
    unit: initial?.unit ?? "",
    current_stock: initial?.current_stock?.toString() ?? "",
    minimum_stock: initial?.minimum_stock?.toString() ?? "",
    unit_cost: initial?.unit_cost?.toString() ?? "",
    supplier: initial?.supplier ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        cafe_id: cafeId,
        name: formData.name,
        unit: formData.unit,
        current_stock: parseFloat(formData.current_stock),
        minimum_stock: parseFloat(formData.minimum_stock),
        unit_cost: parseFloat(formData.unit_cost),
        supplier: formData.supplier || null,
        updated_at: new Date().toISOString(),
      };

      if (initial?.id) {
        const { error } = await supabase
          .from("inventory_items")
          .update(payload)
          .eq("id", initial.id);
        if (error) throw error;
        toast.success("Ingrediente actualizado");
      } else {
        const { error } = await supabase.from("inventory_items").insert(payload);
        if (error) throw error;
        toast.success("Ingrediente agregado");
      }
      onSaved();
    } catch {
      toast.error("Error al guardar el ingrediente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del ingrediente</Label>
          <Input
            id="name"
            placeholder="Ej: Café en grano"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unidad de medida</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) => setFormData({ ...formData, unit: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una unidad" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_stock">Stock actual</Label>
            <Input
              id="current_stock"
              type="number"
              step="0.01"
              placeholder="0"
              value={formData.current_stock}
              onChange={(e) => setFormData({ ...formData, current_stock: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimum_stock">Stock mínimo</Label>
            <Input
              id="minimum_stock"
              type="number"
              step="0.01"
              placeholder="0"
              value={formData.minimum_stock}
              onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_cost">Costo por unidad</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="unit_cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              value={formData.unit_cost}
              onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Proveedor (opcional)</Label>
          <Input
            id="supplier"
            placeholder="Ej: Distribuidora X"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          />
        </div>

        {formData.current_stock && formData.unit_cost && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Valor total en inventario:{" "}
              <span className="font-semibold text-foreground">
                ${(parseFloat(formData.current_stock) * parseFloat(formData.unit_cost)).toLocaleString()}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
