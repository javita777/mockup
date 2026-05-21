"use client";

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { POSProducts } from "@/components/pos/pos-products";
import { POSCart } from "@/components/pos/pos-cart";
import { POSCategories } from "@/components/pos/pos-categories";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { useCafe } from "@/context/cafe-context";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
  customizations?: { name: string; option: string; price: number }[];
  totalPrice: number;
}

export default function POSPage() {
  const { cafeId } = useCafe();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!cafeId) return;
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("cafe_id", cafeId)
      .eq("active", true)
      .order("name");
    setProducts(data ?? []);
  }, [cafeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const addToCart = (product: Product, variant?: string, customizations?: CartItem["customizations"]) => {
    const price = product.price;
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
      setCart([...cart, { product, quantity: 1, variant, customizations, totalPrice: price }]);
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
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = async (paymentMethod: string) => {
    if (!cafeId) return;

    try {
      // 1. Create sale record
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({ cafe_id: cafeId, total: cartTotal, payment_method: paymentMethod })
        .select("id")
        .single();
      if (saleError) throw saleError;

      // 2. Insert sale items
      const { error: itemsError } = await supabase.from("sale_items").insert(
        cart.map((item) => ({
          sale_id: sale.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.totalPrice / item.quantity,
          subtotal: item.totalPrice,
        }))
      );
      if (itemsError) throw itemsError;

      // 3. Fetch recipes for all products in cart
      const productIds = [...new Set(cart.map((item) => item.product.id))];
      const { data: recipes } = await supabase
        .from("recipes")
        .select("*")
        .in("product_id", productIds);

      // 4. Calculate total ingredient usage per inventory item
      const usage: Record<string, number> = {};
      for (const cartItem of cart) {
        const productRecipes = recipes?.filter((r) => r.product_id === cartItem.product.id) ?? [];
        for (const recipe of productRecipes) {
          usage[recipe.inventory_item_id] =
            (usage[recipe.inventory_item_id] ?? 0) + recipe.quantity * cartItem.quantity;
        }
      }

      // 5. Deduct inventory stock
      for (const [itemId, used] of Object.entries(usage)) {
        const { data: inv } = await supabase
          .from("inventory_items")
          .select("current_stock")
          .eq("id", itemId)
          .single();
        if (inv) {
          await supabase
            .from("inventory_items")
            .update({
              current_stock: Math.max(0, inv.current_stock - used),
              updated_at: new Date().toISOString(),
            })
            .eq("id", itemId);
        }
      }

      clearCart();
      toast.success("Venta registrada correctamente");
    } catch {
      toast.error("Error al registrar la venta");
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppShell>
      <PageHeader title="Punto de Venta" description="Registra nuevas ventas">
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
              onCheckout={async (pm) => { await handleCheckout(pm); setMobileCartOpen(false); }}
            />
          </SheetContent>
        </Sheet>
      </PageHeader>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <POSCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <div className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
            <POSProducts products={filteredProducts} onAddToCart={addToCart} />
          </div>
        </div>

        <div className="hidden lg:block w-96 border-l border-border bg-card">
          <POSCart
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            total={cartTotal}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </AppShell>
  );
}
