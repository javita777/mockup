"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  showInactive: boolean;
  onShowInactiveChange: (show: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: { id: string; name: string }[];
}

export function MenuFilters({
  activeCategory,
  onCategoryChange,
  showInactive,
  onShowInactiveChange,
  searchQuery,
  onSearchChange,
  categories,
}: MenuFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="show-inactive"
            checked={showInactive}
            onCheckedChange={onShowInactiveChange}
          />
          <Label htmlFor="show-inactive" className="text-sm text-muted-foreground cursor-pointer">
            Mostrar inactivos
          </Label>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
