import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSiteSettingSchema, type SiteSetting } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SiteSetting>({
    queryKey: ["/api/settings"],
  });

  const form = useForm({
    resolver: zodResolver(insertSiteSettingSchema),
    values: settings || {
      storeName: "AL-MUSLIMAH CLOTHINGS & SHOES",
      whatsapp: "07016342022",
      telegram: "07016342022",
      facebook: "",
      locationKontagora: "1st floor by LAPO office, Madengene plaza, Opposite Korna amala, Kontagora, Niger state.",
      locationAbuja: "Opposite Zahra bread, Compensation lay out, Old kutunku, Gwagwalada FCT, Abuja.",
      heroImageUrl: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-settings-title">
            Store Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your storefront appearance and contact information
          </p>
        </div>

        <div className="max-w-3xl">
          {isLoading ? (
            <Card>
              <CardContent className="p-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="AL-MUSLIMAH CLOTHINGS & SHOES" data-testid="input-store-name" />
                          </FormControl>
                          <FormDescription>
                            This will appear on your storefront
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heroImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Image URL (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/hero.jpg" data-testid="input-hero-image" />
                          </FormControl>
                          <FormDescription>
                            URL for the homepage hero background image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="07016342022" data-testid="input-whatsapp" />
                          </FormControl>
                          <FormDescription>
                            Customers can contact you via WhatsApp
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telegram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="07016342022" data-testid="input-telegram" />
                          </FormControl>
                          <FormDescription>
                            Customers can contact you via Telegram
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Page URL (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://facebook.com/yourpage" data-testid="input-facebook" />
                          </FormControl>
                          <FormDescription>
                            Link to your Facebook page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Store Locations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="locationKontagora"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kontagora Location</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="1st floor by LAPO office, Madengene plaza..."
                              rows={3}
                              data-testid="input-location-kontagora"
                            />
                          </FormControl>
                          <FormDescription>
                            Your store address in Kontagora, Niger State
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationAbuja"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Abuja Location</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Opposite Zahra bread, Compensation lay out..."
                              rows={3}
                              data-testid="input-location-abuja"
                            />
                          </FormControl>
                          <FormDescription>
                            Your store address in Gwagwalada, Abuja
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    data-testid="button-save"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </main>
    </div>
  );
}
