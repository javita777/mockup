"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { POSProducts } from "@/components/pos/pos-products";
import { POSCart } from "@/components/pos/pos-cart";
import { POSCategories } from "@/components/pos/pos-categories";
import { products, type Product } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
  customizations?: { name: string; option: string; price: number }[];
  totalPrice: number;
}

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const filteredProducts = activeCategory === "all"
    ? products.filter((p) => p.active)
    : products.filter((p) => p.active && p.category === activeCategory);

  const addToCart = (product: Product, variant?: string, customizations?: CartItem["customizations"]) => {
    let price = product.price;
    
    if (variant && product.variants) {
      const v = product.variants.find((v) => v.name === variant);
      if (v) price += v.priceModifier;
    }
    
    if (customizations) {
      customizations.forEach((c) => {
        price += c.price;
      });
    }

    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.variant === variant &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      newCart[existingIndex].totalPrice = newCart[existingIndex].quantity * price;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          variant,
          customizations,
          totalPrice: price,
        },
      ]);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    } else {
      const pricePerUnit = newCart[index].totalPrice / (newCart[index].quantity - delta);
      newCart[index].totalPrice = newCart[index].quantity * pricePerUnit;
    }
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppShell>
      <PageHeader title="Punto de Venta" description="Registra nuevas ventas">
        {/* Mobile Cart Button */}
        <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="lg:hidden relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning text-warning-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0">
            <POSCart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onClear={clearCart}
              total={cartTotal}
            />
          </SheetContent>
        </Sheet>
      </PageHeader>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
        {/* Products Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <POSCategories
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
            <POSProducts products={filteredProducts} onAddToCart={addToCart} />
          </div>
        </div>

        {/* Cart - Desktop */}
        <div className="hidden lg:block w-96 border-l border-border bg-card">
          <POSCart
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            total={cartTotal}
          />
        </div>
      </div>
    </AppShell>
  );
}
