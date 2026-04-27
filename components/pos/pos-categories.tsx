"use client";

import { cn } from "@/lib/utils";
import { Coffee, GlassWater, UtensilsCrossed, Cake, LayoutGrid } from "lucide-react";

const categories = [
  { id: "all", name: "Todo", icon: LayoutGrid },
  { id: "bebidas-calientes", name: "Calientes", icon: Coffee },
  { id: "bebidas-frias", name: "Frías", icon: GlassWater },
  { id: "comida", name: "Comida", icon: UtensilsCrossed },
  { id: "postres", name: "Postres", icon: Cake },
];

interface POSCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function POSCategories({ activeCategory, onCategoryChange }: POSCategoriesProps) {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide border-b border-border bg-card/50">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <category.icon className="w-4 h-4" />
          {category.name}
        </button>
      ))}
    </div>
  );
}
