"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Ingredient } from "@/lib/mock-data";
import { MoreVertical, Plus, Minus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryListProps {
  ingredients: Ingredient[];
}

function getStockStatus(ingredient: Ingredient) {
  const percentage = (ingredient.currentStock / ingredient.maxStock) * 100;
  
  if (ingredient.currentStock <= ingredient.minStock) {
    return { status: "danger", label: "Bajo", color: "bg-danger", textColor: "text-danger" };
  }
  if (percentage <= 40) {
    return { status: "warning", label: "Medio", color: "bg-warning", textColor: "text-warning" };
  }
  return { status: "success", label: "OK", color: "bg-success", textColor: "text-success" };
}

export function InventoryList({ ingredients }: InventoryListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron ingredientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ingredients.map((ingredient) => {
        const stockStatus = getStockStatus(ingredient);
        const stockPercentage = Math.min((ingredient.currentStock / ingredient.maxStock) * 100, 100);
        const value = ingredient.currentStock * ingredient.costPerUnit;

        return (
          <Card key={ingredient.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div className={cn(
                  "w-2 h-12 rounded-full flex-shrink-0",
                  stockStatus.color
                )} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{ingredient.name}</h3>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", stockStatus.textColor)}
                    >
                      {stockStatus.label}
                    </Badge>
                  </div>
                  
                  {/* Stock bar */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {ingredient.currentStock} / {ingredient.maxStock} {ingredient.unit}
                      </span>
                      <span className="text-muted-foreground">
                        Mín: {ingredient.minStock} {ingredient.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", stockStatus.color)}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Value */}
                <div className="hidden sm:block text-right">
                  <p className="font-semibold text-foreground">${value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">${ingredient.costPerUnit}/{ingredient.unit}</p>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Plus className="w-3 h-3" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Pencil className="w-4 h-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Mobile value */}
              <div className="sm:hidden mt-3 pt-3 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">Valor en stock:</span>
                <span className="font-semibold text-foreground">${value.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
