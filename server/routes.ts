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
      if (image && image.url) {
        // Extract public_id from Cloudinary URL if it exists
        const urlParts = image.url.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileNameWithExtension.split('.')[0];
        
        // Only try to delete from Cloudinary if it's a Cloudinary URL
        if (image.url.includes('cloudinary.com') && publicId) {
          try {
            await cloudinary.uploader.destroy(`al-muslimah/${publicId}`);
          } catch (cloudinaryError) {
            console.warn('Failed to delete from Cloudinary:', cloudinaryError);
            // Continue with database deletion even if Cloudinary deletion fails
          }
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
          const urlParts = image.url.split('/');
          const fileNameWithExtension = urlParts[urlParts.length - 1];
          const publicId = fileNameWithExtension.split('.')[0];
          
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(`al-muslimah/${publicId}`);
            } catch (cloudinaryError) {
              console.warn('Failed to delete product image from Cloudinary:', cloudinaryError);
            }
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
      if (image && image.url) {
        // Extract public_id from Cloudinary URL if it exists
        const urlParts = image.url.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileNameWithExtension.split('.')[0];
        
        // Only try to delete from Cloudinary if it's a Cloudinary URL
        if (image.url.includes('cloudinary.com') && publicId) {
          try {
            await cloudinary.uploader.destroy(`al-muslimah/${publicId}`);
          } catch (cloudinaryError) {
            console.warn('Failed to delete from Cloudinary:', cloudinaryError);
            // Continue with database deletion even if Cloudinary deletion fails
          }
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
      if (image && image.url) {
        // Extract public_id from Cloudinary URL if it exists
        const urlParts = image.url.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileNameWithExtension.split('.')[0];
        
        // Only try to delete from Cloudinary if it's a Cloudinary URL
        if (image.url.includes('cloudinary.com') && publicId) {
          try {
            await cloudinary.uploader.destroy(`al-muslimah/${publicId}`);
          } catch (cloudinaryError) {
            console.warn('Failed to delete from Cloudinary:', cloudinaryError);
            // Continue with database deletion even if Cloudinary deletion fails
          }
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

  // NEW: Cloudinary File Upload Endpoint
  app.post("/api/upload", async (req, res) => {
    try {
      if (!req.rawBody) {
        return res.status(400).json({ message: "No file data received" });
      }

      // Get content type and validate it's an image
      const contentType = req.headers['content-type'];
      if (!contentType?.startsWith('image/')) {
        return res.status(400).json({ message: "Only image files are allowed" });
      }

      // Check file size (5MB limit)
      if (req.rawBody.length > 5 * 1024 * 1024) {
        return res.status(400).json({ message: "File size exceeds 5MB limit" });
      }

      // Convert buffer to base64 for Cloudinary
      const base64Data = req.rawBody.toString('base64');
      const dataUri = `data:${contentType};base64,${base64Data}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "al-muslimah",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      });

      console.log('Cloudinary upload successful:', uploadResult.secure_url);

      return res.json({ 
        url: uploadResult.secure_url // Permanent Cloudinary URL
      });

    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      
      // Handle Cloudinary-specific errors
      if (error.message?.includes('File size too large')) {
        return res.status(400).json({ message: "File size exceeds 5MB limit" });
      }
      
      if (error.message?.includes('Invalid image file')) {
        return res.status(400).json({ message: "Invalid image file" });
      }

      return res.status(500).json({ 
        message: "Failed to upload image to cloud storage",
        error: error.message 
      });
    }
  });

  // Keep the old upload endpoint for backward compatibility during transition
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage_multer = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage_multer,
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

  // Legacy upload endpoint (you can remove this after full transition)
  app.post("/api/upload-legacy", (req, res) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File size exceeds 5MB limit" });
          }
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      return res.json({ url: fileUrl });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
