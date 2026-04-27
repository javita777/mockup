"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { CustomerList } from "@/components/customers/customer-list";
import { CustomerStats } from "@/components/customers/customer-stats";
import { CustomerDetail } from "@/components/customers/customer-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { customers, type Customer } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CustomerForm } from "@/components/customers/customer-form";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortBy, setSortBy] = useState<"visits" | "points" | "spent">("visits");

  const filteredCustomers = [...customers]
    .filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "visits") return b.visits - a.visits;
      if (sortBy === "points") return b.loyaltyPoints - a.loyaltyPoints;
      return b.totalSpent - a.totalSpent;
    });

  return (
    <AppShell>
      <PageHeader title="Clientes" description="Gestión de clientes y fidelización">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Cliente</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <CustomerForm onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <CustomerStats customers={customers} />

        {/* Search and sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {([
              { key: "visits", label: "Visitas" },
              { key: "points", label: "Puntos" },
              { key: "spent", label: "Gasto" },
            ] as const).map((sort) => (
              <Button
                key={sort.key}
                variant={sortBy === sort.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort.key)}
              >
                {sort.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Customer List */}
        <CustomerList
          customers={filteredCustomers}
          onSelectCustomer={setSelectedCustomer}
        />
      </div>

      {/* Customer Detail Sheet */}
      <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
          {selectedCustomer && <CustomerDetail customer={selectedCustomer} />}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
