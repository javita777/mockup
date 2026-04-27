import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    name: "Nueva Venta",
    description: "Ir al punto de venta",
    href: "/pos",
    icon: ShoppingCart,
    variant: "default" as const,
  },
  {
    name: "Ver Inventario",
    description: "Revisar stock",
    href: "/inventory",
    icon: Package,
    variant: "secondary" as const,
  },
  {
    name: "Agregar Producto",
    description: "Nuevo al menú",
    href: "/menu",
    icon: Plus,
    variant: "secondary" as const,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant={action.variant}
              className="w-full justify-start gap-3 h-auto py-3"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{action.name}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
