import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

const summary = [
  {
    name: "Ingresos Totales",
    value: "$33,980",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    name: "Órdenes",
    value: "628",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: ShoppingBag,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Ticket Promedio",
    value: "$54.10",
    change: "+4.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Clientes Únicos",
    value: "412",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function ReportsSummary() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {summary.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center text-xs font-medium text-success">
                {stat.change}
                <span className="ml-1 text-muted-foreground">vs período anterior</span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
