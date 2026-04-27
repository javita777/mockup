import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { topProducts } from "@/lib/mock-data";
import { Trophy, TrendingUp } from "lucide-react";

export function TopProductsReport() {
  const maxRevenue = Math.max(...topProducts.map((p) => p.revenue));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <CardTitle className="text-base font-semibold">Productos Más Vendidos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold text-muted-foreground">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{product.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{product.sold} vendidos</span>
                    <span className="font-semibold text-foreground">${product.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Top 5 representan el 68% de las ventas</span>
          </div>
          <span className="text-lg font-bold text-foreground">
            ${topProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
