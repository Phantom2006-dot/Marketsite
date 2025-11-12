import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema, type Category, type CategoryImage } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategories() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<CategoryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/categories/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      let categoryId: number;
      
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, data });
        categoryId = editingCategory.id;
      } else {
        const result = await createMutation.mutateAsync(data);
        categoryId = result.id;
      }
      
      // Upload and save new images
      for (let i = 0; i < selectedFiles.length; i++) {
        const imageUrl = await uploadFile(selectedFiles[i]);
        await apiRequest(`/api/categories/${categoryId}/images`, {
          method: "POST",
          body: JSON.stringify({ url: imageUrl, order: i }),
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: editingCategory ? "Category updated successfully" : "Category created successfully" });
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
      setSelectedFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      order: category.order,
    });
    
    // Fetch existing images
    try {
      const images = await apiRequest(`/api/categories/${category.id}/images`);
      setExistingImages(images);
      setSelectedFiles([]);
      setImagePreviews([]);
    } catch (error) {
      setExistingImages([]);
      setSelectedFiles([]);
      setImagePreviews([]);
    }
    
    setIsDialogOpen(true);
  };
  
  const handleDeleteExistingImage = async (imageId: number) => {
    try {
      await apiRequest(`/api/category-images/${imageId}`, { method: "DELETE" });
      setExistingImages(existingImages.filter(img => img.id !== imageId));
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Image deleted successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-categories-title">
              Categories
            </h1>
            <p className="text-muted-foreground">Organize your products into categories</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingCategory(null);
              form.reset();
              setSelectedFiles([]);
              setImagePreviews([]);
              setExistingImages([]);
            }
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-category">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Bubu Gowns"
                            data-testid="input-name"
                            onChange={(e) => {
                              field.onChange(e);
                              if (!editingCategory) {
                                form.setValue("slug", generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL-friendly name)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="bubu-gowns" data-testid="input-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Category description" rows={3} data-testid="input-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Label>Category Images</Label>
                    
                    {existingImages.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Existing Images</p>
                        <div className="grid grid-cols-2 gap-2">
                          {existingImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt="Category"
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteExistingImage(image.id)}
                                data-testid={`button-delete-image-${image.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Add New Images</p>
                      
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeFile(index)}
                                data-testid={`button-remove-file-${index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                          data-testid="input-image-file"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select multiple images (Max 5MB per file)
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-order"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingCategory(null);
                        form.reset();
                      }}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                      data-testid="button-submit"
                    >
                      {isUploading
                        ? "Uploading images..."
                        : createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : editingCategory
                        ? "Update Category"
                        : "Create Category"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 h-24 animate-pulse bg-muted" />
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1" data-testid={`text-category-${category.id}`}>
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                      )}
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-muted-foreground">Order: {category.order}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(category)}
                        data-testid={`button-edit-${category.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            data-testid={`button-delete-${category.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No categories yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
