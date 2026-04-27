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

interface IngredientFormProps {
  onClose: () => void;
}

const units = [
  { value: "kg", label: "Kilogramos (kg)" },
  { value: "L", label: "Litros (L)" },
  { value: "pz", label: "Piezas (pz)" },
  { value: "g", label: "Gramos (g)" },
  { value: "ml", label: "Mililitros (ml)" },
];

export function IngredientForm({ onClose }: IngredientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    costPerUnit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving ingredient:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
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

        {/* Unit */}
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
              {units.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock levels */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentStock">Stock actual</Label>
            <Input
              id="currentStock"
              type="number"
              placeholder="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minStock">Mínimo</Label>
            <Input
              id="minStock"
              type="number"
              placeholder="0"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxStock">Máximo</Label>
            <Input
              id="maxStock"
              type="number"
              placeholder="0"
              value={formData.maxStock}
              onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Cost per unit */}
        <div className="space-y-2">
          <Label htmlFor="costPerUnit">Costo por unidad</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="costPerUnit"
              type="number"
              placeholder="0.00"
              className="pl-7"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Value preview */}
        {formData.currentStock && formData.costPerUnit && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Valor total en inventario:{" "}
              <span className="font-semibold text-foreground">
                ${(parseFloat(formData.currentStock) * parseFloat(formData.costPerUnit)).toLocaleString()}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
      </div>
    </form>
  );
}
