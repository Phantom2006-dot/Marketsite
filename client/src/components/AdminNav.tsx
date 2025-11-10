import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LayoutDashboard, Package, FolderTree, Settings, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import type { SiteSetting } from "@shared/schema";

export function AdminNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  const { data: settings } = useQuery<SiteSetting>({
    queryKey: ["/api/settings"],
  });

  const storeName = settings?.storeName || "AL-MUSLIMAH CLOTHINGS & SHOES";
  
  const canGoBack = location !== "/dashboard";

  const handleBack = () => {
    if (location.startsWith("/dashboard") && location !== "/dashboard") {
      navigate("/dashboard");
    } else {
      window.history.back();
    }
  };

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/categories", icon: FolderTree, label: "Categories" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6" />
              <span className="font-bold text-sm md:text-base">Admin Panel</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="gap-2"
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <Link href="/">
              <Button
                variant="outline"
                className="gap-2"
                data-testid="button-return-site"
              >
                <LogOut className="w-4 h-4" />
                Return to Site
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`link-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="button-mobile-return-site"
                >
                  <LogOut className="w-4 h-4" />
                  Return to Site
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
