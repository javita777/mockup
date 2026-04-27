"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type Customer, recentSales } from "@/lib/mock-data";
import { Star, Phone, Mail, Gift, Calendar, Coffee, ShoppingBag } from "lucide-react";

interface CustomerDetailProps {
  customer: Customer;
}

function getLoyaltyTier(points: number) {
  if (points >= 500) return { name: "Oro", color: "bg-warning text-warning-foreground", nextTier: null, pointsNeeded: 0 };
  if (points >= 200) return { name: "Plata", color: "bg-muted text-muted-foreground", nextTier: "Oro", pointsNeeded: 500 - points };
  return { name: "Bronce", color: "bg-primary/20 text-primary", nextTier: "Plata", pointsNeeded: 200 - points };
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const tier = getLoyaltyTier(customer.loyaltyPoints);
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Mock purchase history based on customer
  const customerSales = recentSales.slice(0, 3);

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-xl font-bold">{initials}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <Badge className={tier.color}>{tier.name}</Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact */}
        <div className="space-y-3">
          <a
            href={`mailto:${customer.email}`}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="w-4 h-4" />
            {customer.email}
          </a>
          <a
            href={`tel:${customer.phone}`}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <Phone className="w-4 h-4" />
            {customer.phone}
          </a>
        </div>

        {/* Loyalty Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning fill-current" />
                <span className="font-semibold text-foreground">{customer.loyaltyPoints} puntos</span>
              </div>
              {tier.nextTier && (
                <span className="text-sm text-muted-foreground">
                  {tier.pointsNeeded} para {tier.nextTier}
                </span>
              )}
            </div>
            {tier.nextTier && (
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full"
                  style={{
                    width: `${(customer.loyaltyPoints / (customer.loyaltyPoints + tier.pointsNeeded)) * 100}%`,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-xl">
            <ShoppingBag className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{customer.visits}</p>
            <p className="text-xs text-muted-foreground">Visitas</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-xl">
            <Coffee className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{customer.favoriteProduct}</p>
            <p className="text-xs text-muted-foreground">Favorito</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-xl">
            <Calendar className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">
              {new Date(customer.lastVisit).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
            </p>
            <p className="text-xs text-muted-foreground">Última visita</p>
          </div>
        </div>

        {/* Purchase History */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Historial de Compras</h3>
          <div className="space-y-3">
            {customerSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {sale.items.map((i) => i.productName).join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.date).toLocaleDateString("es-MX")}
                  </p>
                </div>
                <span className="font-semibold text-foreground">${sale.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1 gap-2">
            <Gift className="w-4 h-4" />
            Dar Puntos
          </Button>
          <Button className="flex-1 gap-2">
            <Mail className="w-4 h-4" />
            Enviar Oferta
          </Button>
        </div>
      </div>
    </div>
  );
}
