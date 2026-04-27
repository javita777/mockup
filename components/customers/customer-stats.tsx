import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, DollarSign, TrendingUp } from "lucide-react";
import { type Customer } from "@/lib/mock-data";

interface CustomerStatsProps {
  customers: Customer[];
}

export function CustomerStats({ customers }: CustomerStatsProps) {
  const totalCustomers = customers.length;
  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgVisits = Math.round(customers.reduce((sum, c) => sum + c.visits, 0) / customers.length);

  const stats = [
    {
      name: "Total Clientes",
      value: totalCustomers.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Puntos Activos",
      value: totalPoints.toLocaleString(),
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      name: "Ventas Totales",
      value: `$${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      name: "Visitas Promedio",
      value: avgVisits.toString(),
      icon: TrendingUp,
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
