"use client";

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCafe } from "@/context/cafe-context";

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  avgTicket: number;
  activeProducts: number;
  yesterdayRevenue: number;
  yesterdayOrders: number;
}

export interface WeekDay {
  day: string;
  ventas: number;
  ordenes: number;
}

export interface TopProduct {
  name: string;
  sold: number;
}

export interface StockAlert {
  id: string;
  name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  unit_cost: number;
  supplier?: string | null;
}

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function buildWeekChart(sales: { total: number; created_at: string }[]): WeekDay[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const daySales = sales.filter((s) => {
      const d = new Date(s.created_at);
      return d >= date && d < nextDate;
    });

    return {
      day: DAY_LABELS[date.getDay()],
      ventas: daySales.reduce((sum, s) => sum + s.total, 0),
      ordenes: daySales.length,
    };
  });
}

export default function DashboardPage() {
  const { cafeId, cafeLoading } = useCafe();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weekData, setWeekData] = useState<WeekDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!cafeId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(todayStart.getDate() - 6);
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(todayStart.getDate() - 30);

    const [
      { data: todaySales },
      { data: yesterdaySales },
      { data: weekSales },
      { data: monthlySaleIds },
      { data: inventoryItems },
      { count: activeProducts },
    ] = await Promise.all([
      supabase.from("sales").select("total").eq("cafe_id", cafeId).gte("created_at", todayStart.toISOString()),
      supabase.from("sales").select("total").eq("cafe_id", cafeId).gte("created_at", yesterdayStart.toISOString()).lt("created_at", todayStart.toISOString()),
      supabase.from("sales").select("total, created_at").eq("cafe_id", cafeId).gte("created_at", sevenDaysAgo.toISOString()),
      supabase.from("sales").select("id").eq("cafe_id", cafeId).gte("created_at", thirtyDaysAgo.toISOString()),
      supabase.from("inventory_items").select("id, name, current_stock, minimum_stock, unit, unit_cost, supplier").eq("cafe_id", cafeId),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("cafe_id", cafeId).eq("active", true),
    ]);

    // Stats
    const todayRevenue = todaySales?.reduce((s, r) => s + r.total, 0) ?? 0;
    const todayOrders = todaySales?.length ?? 0;
    const yesterdayRevenue = yesterdaySales?.reduce((s, r) => s + r.total, 0) ?? 0;
    const yesterdayOrders = yesterdaySales?.length ?? 0;

    setStats({
      todayRevenue,
      todayOrders,
      avgTicket: todayOrders > 0 ? todayRevenue / todayOrders : 0,
      activeProducts: activeProducts ?? 0,
      yesterdayRevenue,
      yesterdayOrders,
    });

    // Week chart
    setWeekData(buildWeekChart(weekSales ?? []));

    // Top products
    const saleIds = monthlySaleIds?.map((s) => s.id) ?? [];
    if (saleIds.length > 0) {
      const { data: items } = await supabase
        .from("sale_items")
        .select("product_id, quantity, products(name)")
        .in("sale_id", saleIds);

      const totals: Record<string, { name: string; sold: number }> = {};
      items?.forEach((item) => {
        const name = (item.products as any)?.name ?? "Desconocido";
        if (!totals[item.product_id]) totals[item.product_id] = { name, sold: 0 };
        totals[item.product_id].sold += item.quantity;
      });
      setTopProducts(Object.values(totals).sort((a, b) => b.sold - a.sold).slice(0, 5));
    } else {
      setTopProducts([]);
    }

    // Stock alerts
    setAlerts(
      (inventoryItems ?? []).filter((i) => i.current_stock <= i.minimum_stock)
    );

    setLoading(false);
  }, [cafeId]);

  useEffect(() => {
    if (!cafeLoading) fetchData();
  }, [fetchData, cafeLoading]);

  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <PageHeader title="Panel de Control" description={today}>
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={fetchData}>
          <CalendarDays className="w-4 h-4" />
          Actualizar
        </Button>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        <DashboardStats stats={stats} loading={loading || cafeLoading} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AlertsPanel alerts={alerts} loading={loading || cafeLoading} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart data={weekData} loading={loading || cafeLoading} />
          </div>
          <div>
            <TopProducts products={topProducts} loading={loading || cafeLoading} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
