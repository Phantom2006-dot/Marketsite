import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  categories?: Array<{ name: string; slug: string }>;
  isTransparent?: boolean;
}

export default function Navbar({ categories = [], isTransparent = false }: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 20);
    });
  }

  const isActive = (path: string) => location === path;
  const navBg = isTransparent && !scrolled ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md border-b';

  return (
    <nav className={`sticky top-0 z-40 transition-all ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-['DM_Sans'] font-bold text-xl">MarketPlace</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <Button 
                  variant="ghost" 
                  className={isActive(`/category/${category.slug}`) ? 'bg-accent' : ''}
                  data-testid={`link-category-${category.slug}`}
                >
                  {category.name}
                </Button>
              </Link>
            ))}
            <Link href="/login">
              <Button variant="ghost" data-testid="link-login">Admin</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-4 py-4 space-y-2">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Button>
              </Link>
            ))}
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
