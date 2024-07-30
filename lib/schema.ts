import { z } from 'zod';

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