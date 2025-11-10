import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, FolderOpen, ShoppingBag } from "lucide-react";
import type { Product, Category } from "@shared/schema";

export default function AdminDashboard() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const productCount = products?.length || 0;
  const categoryCount = categories?.length || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your e-commerce store
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-products">
                {productCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-categories">
                {categoryCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Store Status
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-store-status">
                Active
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/products">
                <div className="p-4 border rounded-md hover-elevate cursor-pointer">
                  <p className="font-medium">Manage Products</p>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                </div>
              </Link>
              <Link href="/dashboard/categories">
                <div className="p-4 border rounded-md hover-elevate cursor-pointer">
                  <p className="font-medium">Manage Categories</p>
                  <p className="text-sm text-muted-foreground">Organize your product categories</p>
                </div>
              </Link>
              <Link href="/dashboard/settings">
                <div className="p-4 border rounded-md hover-elevate cursor-pointer">
                  <p className="font-medium">Store Settings</p>
                  <p className="text-sm text-muted-foreground">Update contact info and preferences</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              {products && products.length > 0 ? (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">₦{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No products yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Welcome to your admin panel! Here's how to get started:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Create categories to organize your products</li>
                <li>Add products with images and details</li>
                <li>Update store settings with contact information</li>
                <li>Share your storefront with customers</li>
              </ol>
              <div className="flex gap-4">
                <Link href="/dashboard/categories">
                  <Button data-testid="button-get-started">Get Started</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" data-testid="button-view-store">View Storefront</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
