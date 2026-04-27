import { Card, CardContent } from "@/components/ui/card";
import { Package, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { type Ingredient } from "@/lib/mock-data";

interface InventoryStatsProps {
  ingredients: Ingredient[];
}

export function InventoryStats({ ingredients }: InventoryStatsProps) {
  const lowStock = ingredients.filter((i) => i.currentStock <= i.minStock).length;
  const okStock = ingredients.filter((i) => i.currentStock > i.minStock).length;
  const totalValue = ingredients.reduce((sum, i) => sum + i.currentStock * i.costPerUnit, 0);

  const stats = [
    {
      name: "Total Ingredientes",
      value: ingredients.length.toString(),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Stock Bajo",
      value: lowStock.toString(),
      icon: AlertTriangle,
      color: "text-danger",
      bgColor: "bg-danger/10",
    },
    {
      name: "Stock OK",
      value: okStock.toString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      name: "Valor Total",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
