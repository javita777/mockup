"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, UNITS } from "@/lib/types";
import type { InventoryItem, Product } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface RecipeRow {
  inventory_item_id: string;
  quantity: string;
  unit: string;
}

interface ProductFormProps {
  cafeId: string;
  onClose: () => void;
  onSaved: () => void;
  initial?: Product;
}

export function ProductForm({ cafeId, onClose, onSaved, initial }: ProductFormProps) {
  const [saving, setSaving] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [formData, setFormData] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? "",
    description: initial?.description ?? "",
    price: initial?.price?.toString() ?? "",
    cost: initial?.cost?.toString() ?? "",
    active: initial?.active ?? true,
  });
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);

  useEffect(() => {
    supabase
      .from("inventory_items")
      .select("*")
      .eq("cafe_id", cafeId)
      .order("name")
      .then(({ data }) => setInventoryItems(data ?? []));

    if (initial?.id) {
      supabase
        .from("recipes")
        .select("*")
        .eq("product_id", initial.id)
        .then(({ data }) => {
          if (data) {
            setRecipes(
              data.map((r) => ({
                inventory_item_id: r.inventory_item_id,
                quantity: r.quantity.toString(),
                unit: r.unit,
              }))
            );
          }
        });
    }
  }, [cafeId, initial?.id]);

  const addRecipeRow = () => {
    setRecipes([...recipes, { inventory_item_id: "", quantity: "", unit: "" }]);
  };

  const removeRecipeRow = (index: number) => {
    setRecipes(recipes.filter((_, i) => i !== index));
  };

  const updateRecipeRow = (index: number, field: keyof RecipeRow, value: string) => {
    const updated = recipes.map((r, i) => {
      if (i !== index) return r;
      const next = { ...r, [field]: value };
      if (field === "inventory_item_id") {
        const item = inventoryItems.find((it) => it.id === value);
        if (item) next.unit = item.unit;
      }
      return next;
    });
    setRecipes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        cafe_id: cafeId,
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        active: formData.active,
        updated_at: new Date().toISOString(),
      };

      let productId = initial?.id;

      if (productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
        // Replace recipes
        await supabase.from("recipes").delete().eq("product_id", productId);
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        productId = data.id;
      }

      const validRecipes = recipes.filter(
        (r) => r.inventory_item_id && r.quantity && parseFloat(r.quantity) > 0
      );

      if (validRecipes.length > 0) {
        const { error } = await supabase.from("recipes").insert(
          validRecipes.map((r) => ({
            cafe_id: cafeId,
            product_id: productId,
            inventory_item_id: r.inventory_item_id,
            quantity: parseFloat(r.quantity),
            unit: r.unit,
          }))
        );
        if (error) throw error;
      }

      toast.success(initial?.id ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch {
      toast.error("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const margin =
    formData.price && formData.cost
      ? (
          ((parseFloat(formData.price) - parseFloat(formData.cost)) /
            parseFloat(formData.price)) *
          100
        ).toFixed(1)
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del producto</Label>
          <Input
            id="name"
            placeholder="Ej: Latte especial"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Precio de venta</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Costo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {margin !== null && (
          <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
            Margen:{" "}
            <span className="font-semibold text-foreground">{margin}%</span>
            {" | "}Ganancia:{" "}
            <span className="font-semibold text-success">
              ${(parseFloat(formData.price) - parseFloat(formData.cost)).toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="active">Producto activo</Label>
            <p className="text-sm text-muted-foreground">Visible en el punto de venta</p>
          </div>
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(v) => setFormData({ ...formData, active: v })}
          />
        </div>
      </div>

      {/* Recipe / Ingredients */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <Label>Ingredientes de la receta</Label>
          <Button type="button" variant="outline" size="sm" onClick={addRecipeRow} className="gap-1">
            <Plus className="w-3 h-3" />
            Agregar
          </Button>
        </div>

        {recipes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Sin ingredientes registrados. Agrégalos para descontar stock automáticamente al vender.
          </p>
        )}

        {recipes.map((row, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Select
                value={row.inventory_item_id}
                onValueChange={(v) => updateRecipeRow(index, "inventory_item_id", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Ingrediente" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-24 space-y-1">
              <Input
                type="number"
                step="0.001"
                placeholder="Cant."
                className="h-9"
                value={row.quantity}
                onChange={(e) => updateRecipeRow(index, "quantity", e.target.value)}
              />
            </div>
            <div className="w-20 space-y-1">
              <Select
                value={row.unit}
                onValueChange={(v) => updateRecipeRow(index, "unit", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Un." />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-destructive"
              onClick={() => removeRecipeRow(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Producto"}
        </Button>
      </div>
    </form>
  );
}
