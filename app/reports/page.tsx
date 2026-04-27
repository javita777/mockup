"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { SalesOverTimeChart } from "@/components/reports/sales-over-time-chart";
import { SalesByCategoryChart } from "@/components/reports/sales-by-category-chart";
import { TopProductsReport } from "@/components/reports/top-products-report";
import { Button } from "@/components/ui/button";
import { Download, CalendarDays } from "lucide-react";

const periods = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Esta Semana" },
  { key: "month", label: "Este Mes" },
  { key: "year", label: "Este Año" },
] as const;

export default function ReportsPage() {
  const [activePeriod, setActivePeriod] = useState<string>("week");

  return (
    <AppShell>
      <PageHeader title="Reportes" description="Análisis de ventas y rendimiento">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {/* Period selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {periods.map((period) => (
            <Button
              key={period.key}
              variant={activePeriod === period.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActivePeriod(period.key)}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Summary */}
        <ReportsSummary />

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesOverTimeChart />
          <SalesByCategoryChart />
        </div>

        {/* Top Products */}
        <TopProductsReport />
      </div>
    </AppShell>
  );
}
