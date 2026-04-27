import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { todaySummary } from "@/lib/mock-data";

const stats = [
  {
    name: "Ventas del Día",
    value: `$${todaySummary.revenue.toLocaleString()}`,
    change: `+${todaySummary.comparedToYesterday.revenue}%`,
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    name: "Órdenes",
    value: todaySummary.orders.toString(),
    change: `+${todaySummary.comparedToYesterday.orders}%`,
    changeType: "positive" as const,
    icon: ShoppingBag,
  },
  {
    name: "Clientes",
    value: todaySummary.customers.toString(),
    change: `+${todaySummary.comparedToYesterday.customers}%`,
    changeType: "positive" as const,
    icon: Users,
  },
  {
    name: "Ticket Promedio",
    value: `$${todaySummary.averageTicket.toFixed(0)}`,
    change: "+3%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center text-xs font-medium text-success">
                {stat.change}
                <span className="ml-1 text-muted-foreground">vs ayer</span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
