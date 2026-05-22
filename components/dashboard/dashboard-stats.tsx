"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, TrendingUp, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats as Stats } from "@/app/dashboard/page";

interface DashboardStatsProps {
  stats: Stats | null;
  loading: boolean;
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  return pct;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const items = [
    {
      name: "Ventas del Día",
      value: stats ? `$${stats.todayRevenue.toLocaleString("es-CL")}` : "$0",
      change: stats ? pctChange(stats.todayRevenue, stats.yesterdayRevenue) : null,
      icon: DollarSign,
    },
    {
      name: "Órdenes",
      value: stats ? stats.todayOrders.toString() : "0",
      change: stats ? pctChange(stats.todayOrders, stats.yesterdayOrders) : null,
      icon: ShoppingBag,
    },
    {
      name: "Ticket Promedio",
      value: stats ? `$${stats.avgTicket.toFixed(0)}` : "$0",
      change: null,
      icon: TrendingUp,
    },
    {
      name: "Productos Activos",
      value: stats ? stats.activeProducts.toString() : "0",
      change: null,
      icon: UtensilsCrossed,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.name} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className={cn("text-2xl font-bold text-foreground", loading && "text-muted-foreground animate-pulse")}>
                  {loading ? "…" : item.value}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-3 h-4">
              {!loading && item.change !== null && (
                <span className={cn(
                  "inline-flex items-center text-xs font-medium",
                  item.change >= 0 ? "text-success" : "text-danger"
                )}>
                  {item.change >= 0 ? "+" : ""}{item.change.toFixed(1)}%
                  <span className="ml-1 text-muted-foreground">vs ayer</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
