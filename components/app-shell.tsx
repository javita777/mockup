"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { BottomNav } from "./bottom-nav";
import { auth } from "@/lib/auth";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = auth.getActiveUser();
    if (!user) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Optionally prevent rendering until checked to avoid flicker
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="md:pl-64">
        <div className="min-h-screen pb-20 md:pb-0">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
