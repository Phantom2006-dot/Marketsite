import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate credentials
      if (username.trim().toLowerCase() !== "admin") {
        toast({
          title: "Invalid credentials",
          description: "Username or password is incorrect",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (password !== "Admin1234") {
        toast({
          title: "Invalid credentials",
          description: "Username or password is incorrect",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Successful login
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      
      // Store login state (you might want to use context or localStorage in a real app)
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ username: "admin", role: "admin" }));
      
      setLocation("/dashboard");
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <span className="font-['DM_Sans'] font-bold text-2xl">MarketPlace Admin</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to manage your store</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="input-username"
                  placeholder="Enter admin username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                  placeholder="Enter admin password"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                data-testid="button-login"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              /* {/* Demo credentials hint */}
              <div className="text-center text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                <p className="font-medium">Demo Credentials:</p>
                <p>Username: <strong>admin</strong></p>
                <p>Password: <strong>Admin1234</strong></p>
              </div> */
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
