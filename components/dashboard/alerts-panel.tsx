import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { alerts } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-warning/10",
    iconColor: "text-warning",
    borderColor: "border-l-warning",
  },
  danger: {
    icon: AlertCircle,
    bgColor: "bg-danger/10",
    iconColor: "text-danger",
    borderColor: "border-l-danger",
  },
  info: {
    icon: Info,
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    borderColor: "border-l-primary",
  },
};

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Alertas</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">{alerts.length} pendientes</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = alertConfig[alert.type];
            return (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border-l-4",
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className={cn("mt-0.5", config.iconColor)}>
                  <config.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
