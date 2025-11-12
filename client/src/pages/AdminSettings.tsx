import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSiteSettingSchema, type SiteSetting } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Simple fetch-based mutation without apiRequest
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Updating settings with data:', data);
      
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setSelectedFile(null);
      setImagePreview(null);
      toast({ 
        title: "Success", 
        description: "Settings updated successfully" 
      });
    },
    onError: (error: any) => {
      console.error('Settings update error:', error);
      
      // Try to parse JSON error message
      let errorMessage = error.message || "Failed to save settings";
      try {
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If not JSON, use the original message
      }
      
      toast({
        title: "Error updating settings",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    console.log('Uploading file:', file.name);
    
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      throw new Error("Failed to upload file: " + errorText);
    }

    const result = await response.json();
    console.log('Upload successful, URL:', result.url);
    return result.url;
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      console.log('Form submitted with data:', data);

      // If there's a selected file, upload it first
      if (selectedFile) {
        console.log('Uploading selected file:', selectedFile.name);
        const imageUrl = await uploadFile(selectedFile);
        data.heroImageUrl = imageUrl;
        console.log('Updated data with new hero image:', data);
      }

      // Ensure we have all required fields with fallbacks
      const submitData = {
        storeName: data.storeName || "AL-MUSLIMAH CLOTHINGS & SHOES",
        whatsapp: data.whatsapp || "07016342022",
        telegram: data.telegram || "07016342022",
        facebook: data.facebook || "",
        locationKontagora: data.locationKontagora || "1st floor by LAPO office, Madengene plaza, Opposite Korna amala, Kontagora, Niger state.",
        locationAbuja: data.locationAbuja || "Opposite Zahra bread, Compensation lay out, Old kutunku, Gwagwalada FCT, Abuja.",
        heroImageUrl: data.heroImageUrl || "",
      };

      console.log('Final data to submit:', submitData);
      updateMutation.mutate(submitData);
      
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, GIF, or WebP image",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeExistingHeroImage = () => {
    form.setValue("heroImageUrl", "");
    // Create update data without the hero image
    const updateData = {
      ...form.getValues(),
      heroImageUrl: ""
    };
    updateMutation.mutate(updateData);
  };

  const removeNewHeroImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
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
                            <Input
                              {...field}
                              placeholder="AL-MUSLIMAH CLOTHINGS & SHOES"
                              data-testid="input-store-name"
                            />
                          </FormControl>
                          <FormDescription>
                            This will appear on your storefront
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Label>Hero Background Image</Label>

                      {/* Show existing hero image with remove option */}
                      {settings?.heroImageUrl && !selectedFile && (
                        <div className="relative group">
                          <img
                            src={settings.heroImageUrl}
                            alt="Current hero image"
                            className="w-full h-48 object-cover rounded-md border"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">Current Hero Image</p>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeExistingHeroImage}
                            data-testid="button-remove-hero-image"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {/* Show new image preview when a file is selected */}
                      {imagePreview && selectedFile && (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="New hero preview"
                            className="w-full h-48 object-cover rounded-md border"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">New Hero Image Preview</p>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeNewHeroImage}
                            data-testid="button-remove-new-hero"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {/* File input */}
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="hero-image-file"
                          data-testid="input-hero-image-file"
                        />
                        <label htmlFor="hero-image-file" className="cursor-pointer block">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-2xl">+</span>
                            </div>
                            <p className="text-sm font-medium">
                              {settings?.heroImageUrl ? "Replace Hero Image" : "Upload Hero Image"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click to upload a background image for your homepage (Max 5MB)
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Show current hero image URL if exists */}
                      {settings?.heroImageUrl && (
                        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                          <strong>Current Image:</strong> {settings.heroImageUrl}
                        </div>
                      )}
                    </div>
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
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="07016342022"
                              data-testid="input-whatsapp"
                            />
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
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="07016342022"
                              data-testid="input-telegram"
                            />
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
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="https://facebook.com/yourpage"
                              data-testid="input-facebook"
                            />
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
                              value={field.value ?? ""}
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
                              value={field.value ?? ""}
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

                <div className="flex justify-end gap-4">
                  {(selectedFile || form.formState.isDirty) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending || isUploading}
                    data-testid="button-save"
                  >
                    {(updateMutation.isPending || isUploading) ? "Saving..." : "Save Settings"}
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
