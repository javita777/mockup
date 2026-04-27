import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <PageHeader title="Panel de Control" description={today}>
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
          <CalendarDays className="w-4 h-4" />
          Hoy
        </Button>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions - Mobile */}
        <div className="md:hidden">
          <QuickActions />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <SalesChart />
          </div>

          {/* Top Products */}
          <div>
            <TopProducts />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Alerts */}
          <div className="lg:col-span-2">
            <AlertsPanel />
          </div>

          {/* Quick Actions - Desktop */}
          <div className="hidden md:block">
            <QuickActions />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
