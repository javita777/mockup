import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { topProducts } from "@/lib/mock-data";
import { Trophy } from "lucide-react";

export function TopProducts() {
  const maxSold = Math.max(...topProducts.map((p) => p.sold));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" />
          <CardTitle className="text-base font-semibold">Más Vendidos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="font-medium text-foreground">{product.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-foreground">{product.sold}</span>
                  <span className="text-muted-foreground ml-1">vendidos</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(product.sold / maxSold) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
