"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Package,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart3, ClipboardList } from "lucide-react";

const mainNav = [
  { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
  { name: "Venta", href: "/pos", icon: ShoppingCart },
  { name: "Menú", href: "/menu", icon: UtensilsCrossed },
  { name: "Stock", href: "/inventory", icon: Package },
  { name: "Más", href: "#more", icon: MoreHorizontal },
];

const moreNav = [
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
  { name: "Operaciones", href: "/operations", icon: ClipboardList },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {mainNav.map((item) => {
          if (item.href === "#more") {
            const isMoreActive = moreNav.some((m) => pathname.startsWith(m.href));
            return (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs transition-colors",
                      isMoreActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mb-2">
                  {moreNav.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link
                        href={subItem.href}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <subItem.icon className="w-4 h-4" />
                        {subItem.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
