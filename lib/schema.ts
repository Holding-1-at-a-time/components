import { z } from 'zod';
<<<<<<< HEAD
=======
import { Id } from '@/convex/_generated/dataModel';

export const selfAssessmentSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  vin: z.string().length(17, 'VIN must be 17 characters'),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),
  hotspotAssessment: z.array(z.object({
    part: z.string(),
    issue: z.string(),
  })),
  selectedServices: z.array(z.string()),
  customizations: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
  })),
  images: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
  })),
  videos: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
  })),
});

export type SelfAssessmentFormData = z.infer<typeof selfAssessmentSchema>;
>>>>>>> c51587409a955418810f61cf695203e9470b93e5

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().length(17, "VIN must be 17 characters"),
  color: z.string().min(1, "Color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  vehicleTypeId: z.string().min(1, "Vehicle type is required"),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;    