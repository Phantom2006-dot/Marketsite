import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  categories?: Array<{ name: string; slug: string }>;
  isTransparent?: boolean;
  logoUrl?: string;  // New prop
  logoAlt?: string;  // New prop
}

export default function Navbar({
  categories = [],
  isTransparent = false,
  logoUrl = "/logo.jpg",  // FIXED: updated to logo.jpg
  logoAlt = "AL-MUSLIMAH Logo",  // Default alt text
}: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fixed useEffect with proper dependency and cleanup
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Use requestAnimationFrame for better performance
    let ticking = false;
    const updateScroll = () => {
      handleScroll();
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  const isActive = (path: string) => location === path;
  const navBg =
    isTransparent && !scrolled
      ? "bg-transparent"
      : "bg-background/95 backdrop-blur-md border-b";

  return (
    <nav className={`sticky top-0 z-40 transition-all ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/">
            <div
              className="flex items-center gap-3 cursor-pointer"
              data-testid="link-home"
            >
              {/* Logo Image */}
              <img 
                src={logoUrl}
                alt={logoAlt}
                className="h-10 w-10 rounded-full object-cover border-2 border-primary/20 shadow-sm"
              />
              
              {/* Text with improved layout */}
              <div className="flex flex-col">
                <span className="font-['DM_Sans'] font-bold text-xl leading-tight">
                  AL-MUSLIMAH
                </span>
                <span className="text-xs text-muted-foreground">
                  Clothings & Shoes
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <Button
                variant="ghost"
                className={isActive("/") ? "bg-accent" : ""}
                data-testid="link-nav-home"
              >
                Home
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={
                    location.startsWith("/category") ||
                    location === "/categories"
                      ? "bg-accent"
                      : ""
                  }
                  data-testid="button-store-dropdown"
                >
                  Store <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/categories">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    data-testid="link-all-categories"
                  >
                    All Categories
                  </DropdownMenuItem>
                </Link>
                {categories.map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      data-testid={`link-category-${category.slug}`}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about">
              <Button
                variant="ghost"
                className={isActive("/about") ? "bg-accent" : ""}
                data-testid="link-about"
              >
                About Us
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="ghost"
                className={isActive("/contact") ? "bg-accent" : ""}
                data-testid="link-contact"
              >
                Contact Us
              </Button>
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
          </div>
        </div>
      )}
    </nav>
  );
}
