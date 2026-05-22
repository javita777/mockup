import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Bell, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockAlert } from "@/app/dashboard/page";

interface AlertsPanelProps {
  alerts: StockAlert[];
  loading: boolean;
}

export function AlertsPanel({ alerts, loading }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Alertas de Inventario</CardTitle>
          </div>
          {!loading && (
            <span className="text-xs text-muted-foreground">
              {alerts.length > 0 ? `${alerts.length} ingrediente${alerts.length > 1 ? "s" : ""} con stock bajo` : "Todo en orden"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border-l-4 border-l-success">
            <CheckCircle className="w-4 h-4 text-success shrink-0" />
            <p className="text-sm font-medium text-foreground">
              Todos los ingredientes tienen stock suficiente
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const isDanger = alert.current_stock === 0;
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border-l-4",
                    isDanger
                      ? "bg-danger/10 border-l-danger"
                      : "bg-warning/10 border-l-warning"
                  )}
                >
                  <div className={cn("mt-0.5 shrink-0", isDanger ? "text-danger" : "text-warning")}>
                    {isDanger ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Stock actual: <span className="font-semibold">{alert.current_stock} {alert.unit}</span>
                      {" — "}
                      Mínimo: {alert.minimum_stock} {alert.unit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
