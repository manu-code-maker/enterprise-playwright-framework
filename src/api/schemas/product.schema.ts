import { z } from 'zod';

export const dimensionsSchema = z.object({
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
  depth: z.number().nonnegative(),
});

export const reviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string(),
});

export const productMetaSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  barcode: z.string(),
  qrCode: z.string(),
});

export const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  category: z.string(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
  stock: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  weight: z.number().optional(),
  dimensions: dimensionsSchema.optional(),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  availabilityStatus: z.string().optional(),
  reviews: z.array(reviewSchema).optional(),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.number().optional(),
  meta: productMetaSchema.optional(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
}).strict();

export const productListResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
}).strict();

export type Product = z.infer<typeof productSchema>;
export type ProductListResponse = z.infer<typeof productListResponseSchema>;
