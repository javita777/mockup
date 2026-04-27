"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Customer } from "@/lib/mock-data";
import { Star, ChevronRight } from "lucide-react";

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

function getLoyaltyTier(points: number) {
  if (points >= 500) return { name: "Oro", color: "bg-warning text-warning-foreground" };
  if (points >= 200) return { name: "Plata", color: "bg-muted text-muted-foreground" };
  return { name: "Bronce", color: "bg-primary/20 text-primary" };
}

export function CustomerList({ customers, onSelectCustomer }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron clientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((customer) => {
        const tier = getLoyaltyTier(customer.loyaltyPoints);
        const initials = customer.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        return (
          <Card
            key={customer.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectCustomer(customer)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{customer.name}</h3>
                    <Badge className={tier.color}>{tier.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                </div>

                {/* Points and stats */}
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-foreground">{customer.loyaltyPoints}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">puntos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{customer.visits}</p>
                    <p className="text-xs text-muted-foreground">visitas</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">${customer.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">gastado</p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>

              {/* Mobile stats */}
              <div className="sm:hidden mt-3 pt-3 border-t border-border flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-warning fill-current" />
                  <span className="font-medium">{customer.loyaltyPoints} pts</span>
                </div>
                <span className="text-muted-foreground">{customer.visits} visitas</span>
                <span className="font-medium">${customer.totalSpent.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
