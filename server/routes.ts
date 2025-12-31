import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCategorySchema,
  insertCategoryImageSchema,
  insertProductSchema,
  insertProductImageSchema,
  insertHeroImageSchema,
  insertSiteSettingSchema,
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { cloudinary } from "./lib/cloudinary";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route for deployment platforms
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Category routes
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // First, check if category exists
      const existingCategory = await storage.getCategory(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Check if there are products in this category
      const productsInCategory = await storage.getProductsByCategory(id);
      if (productsInCategory && productsInCategory.length > 0) {
        return res.status(400).json({
          message:
            "Cannot delete category with existing products. Please remove or reassign products first.",
        });
      }

      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete category" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting category:", error);

      // Provide more specific error messages
      if (error.message?.includes("foreign key constraint")) {
        return res.status(400).json({
          message:
            "Cannot delete category because it is referenced by other records. Please remove all products and images first.",
        });
      }

      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const category = await storage.getCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Category image routes
  app.get("/api/categories/:categoryId/images", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const images = await storage.getCategoryImages(categoryId);
      res.json(images);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/categories/:categoryId/images", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const validatedData = insertCategoryImageSchema.parse({
        ...req.body,
        categoryId,
      });
      const image = await storage.createCategoryImage(validatedData);
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/category-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the image first to extract Cloudinary public ID for deletion
      const image = await storage.getCategoryImage(id);
      if (image && image.url && image.url.includes('cloudinary.com')) {
        try {
          // Extract public_id from Cloudinary URL properly
          const urlParts = image.url.split('/');
          const uploadIndex = urlParts.indexOf('upload');
          if (uploadIndex !== -1) {
            // Get everything after 'upload' and remove file extension
            const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
            const publicId = pathAfterUpload.replace(/\.[^/.]+$/, ""); // Remove file extension
            
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
              console.log('Deleted from Cloudinary:', publicId);
            }
          }
        } catch (cloudinaryError) {
          console.warn('Failed to delete from Cloudinary:', cloudinaryError);
          // Continue with database deletion even if Cloudinary deletion fails
        }
      }
      
      const deleted = await storage.deleteCategoryImage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Product routes
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Delete product images from Cloudinary first
      const productImages = await storage.getProductImages(id);
      for (const image of productImages) {
        if (image.url && image.url.includes('cloudinary.com')) {
          try {
            const urlParts = image.url.split('/');
            const uploadIndex = urlParts.indexOf('upload');
            if (uploadIndex !== -1) {
              const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
              const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
              
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                console.log('Deleted product image from Cloudinary:', publicId);
              }
            }
          } catch (cloudinaryError) {
            console.warn('Failed to delete product image from Cloudinary:', cloudinaryError);
          }
        }
      }
      
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const product = await storage.getProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Product image routes
  app.get("/api/products/:productId/images", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const images = await storage.getProductImages(productId);
      res.json(images);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products/:productId/images", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const validatedData = insertProductImageSchema.parse({
        ...req.body,
        productId,
      });
      const image = await storage.createProductImage(validatedData);
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/product-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the image first to extract Cloudinary public ID for deletion
      const image = await storage.getProductImage(id);
      if (image && image.url && image.url.includes('cloudinary.com')) {
        try {
          const urlParts = image.url.split('/');
          const uploadIndex = urlParts.indexOf('upload');
          if (uploadIndex !== -1) {
            const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
            const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
            
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
              console.log('Deleted from Cloudinary:', publicId);
            }
          }
        } catch (cloudinaryError) {
          console.warn('Failed to delete from Cloudinary:', cloudinaryError);
        }
      }
      
      const deleted = await storage.deleteProductImage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Hero image routes
  app.get("/api/hero-images", async (_req, res) => {
    try {
      const images = await storage.getHeroImages();
      res.json(images);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/hero-images", async (req, res) => {
    try {
      const validatedData = insertHeroImageSchema.parse(req.body);
      const image = await storage.createHeroImage(validatedData);
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/hero-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the image first to extract Cloudinary public ID for deletion
      const image = await storage.getHeroImage(id);
      if (image && image.url && image.url.includes('cloudinary.com')) {
        try {
          const urlParts = image.url.split('/');
          const uploadIndex = urlParts.indexOf('upload');
          if (uploadIndex !== -1) {
            const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
            const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
            
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
              console.log('Deleted from Cloudinary:', publicId);
            }
          }
        } catch (cloudinaryError) {
          console.warn('Failed to delete from Cloudinary:', cloudinaryError);
        }
      }
      
      const deleted = await storage.deleteHeroImage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Site settings routes
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateSiteSettings(req.body);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // NEW: Cloudinary File Upload Endpoint (FIXED VERSION)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    },
  });

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log('Uploading file to Cloudinary:', {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      // Convert buffer to base64 for Cloudinary
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: "al-muslimah",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      });

      console.log('Cloudinary upload successful:', uploadResult.secure_url);

      return res.json({ 
        url: uploadResult.secure_url
      });

    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      
      if (error.message?.includes('File size too large')) {
        return res.status(400).json({ message: "File size exceeds 5MB limit" });
      }
      
      return res.status(500).json({ 
        message: "Upload failed",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
