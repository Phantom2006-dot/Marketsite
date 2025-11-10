import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavbarProps {
  categories?: Array<{ name: string; slug: string }>;
  isTransparent?: boolean;
}

export default function Navbar({ categories = [], isTransparent = false }: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location === path;
  const navBg = isTransparent && !scrolled ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md border-b';

  return (
    <nav className={`sticky top-0 z-40 transition-all ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-['DM_Sans'] font-bold text-xl">AL-MUSLIMAH CLOTHINGS & SHOES</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                className={isActive('/') ? 'bg-accent' : ''}
                data-testid="link-nav-home"
              >
                Home
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={location.startsWith('/category') || location === '/categories' ? 'bg-accent' : ''}
                  data-testid="button-store-dropdown"
                >
                  Store <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/categories">
                  <DropdownMenuItem className="cursor-pointer" data-testid="link-all-categories">
                    All Categories
                  </DropdownMenuItem>
                </Link>
                {categories.map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`}>
                    <DropdownMenuItem className="cursor-pointer" data-testid={`link-category-${category.slug}`}>
                      {category.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about">
              <Button 
                variant="ghost" 
                className={isActive('/about') ? 'bg-accent' : ''}
                data-testid="link-about"
              >
                About Us
              </Button>
            </Link>

            <Link href="/contact">
              <Button 
                variant="ghost" 
                className={isActive('/contact') ? 'bg-accent' : ''}
                data-testid="link-contact"
              >
                Contact Us
              </Button>
            </Link>

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
            <Link href="/">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-home"
              >
                Home
              </Button>
            </Link>

            <Link href="/categories">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-categories"
              >
                All Categories
              </Button>
            </Link>

            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start pl-8"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-category-${category.slug}`}
                >
                  {category.name}
                </Button>
              </Link>
            ))}

            <Link href="/about">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-about"
              >
                About Us
              </Button>
            </Link>

            <Link href="/contact">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-contact"
              >
                Contact Us
              </Button>
            </Link>

            <Link href="/login">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-admin"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
