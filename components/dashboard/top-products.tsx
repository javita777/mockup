import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { TopProduct } from "@/app/dashboard/page";

interface TopProductsProps {
  products: TopProduct[];
  loading: boolean;
}

export function TopProducts({ products, loading }: TopProductsProps) {
  const maxSold = products.length > 0 ? Math.max(...products.map((p) => p.sold)) : 1;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" />
          <CardTitle className="text-base font-semibold">Más Vendidos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-2 bg-muted animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Sin ventas en los últimos 30 días
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[120px]">{product.name}</span>
                  </div>
                  <div className="text-right shrink-0">
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
        )}
      </CardContent>
    </Card>
  );
}
