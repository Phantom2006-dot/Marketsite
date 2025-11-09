import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderOpen, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Products", value: "42", icon: Package, change: "+12%" },
    { name: "Categories", value: "8", icon: FolderOpen, change: "+2" },
    { name: "Total Revenue", value: "$12,450", icon: DollarSign, change: "+23%" },
    { name: "Growth", value: "18.2%", icon: TrendingUp, change: "+4.3%" },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-['DM_Sans'] font-bold text-3xl mb-2" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your marketplace performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid={`stat-${stat.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">Product updated</p>
                      <p className="text-sm text-muted-foreground">Wireless Speaker - 2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-4 border rounded-lg hover-elevate cursor-pointer">
                <p className="font-medium">Add New Product</p>
                <p className="text-sm text-muted-foreground">Create a new product listing</p>
              </div>
              <div className="p-4 border rounded-lg hover-elevate cursor-pointer">
                <p className="font-medium">Manage Categories</p>
                <p className="text-sm text-muted-foreground">Organize your product categories</p>
              </div>
              <div className="p-4 border rounded-lg hover-elevate cursor-pointer">
                <p className="font-medium">Update Settings</p>
                <p className="text-sm text-muted-foreground">Configure store settings</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
