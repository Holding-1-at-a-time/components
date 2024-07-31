// File: components/forms/VehicleInformationForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input, Label, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import { VINScanner } from '@/components/VINScanner';
import { AutocompleteInput } from '@/components/AutocompleteInput';

const { data: detailingPackages } = useQuery(api.services.getDetailingPackages, { vehicleType: vinData.bodyStyle });


const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().length(17, "VIN must be 17 characters"),
  mileage: z.number().positive(),
  exteriorColor: z.string().min(1, "Exterior color is required"),
  interiorColor: z.string().min(1, "Interior color is required"),
  modifications: z.string().optional(),
  trimLevel: z.string().optional(),
  engineType: z.string().optional(),
  transmissionType: z.string().optional(),
  driveType: z.enum(['FWD', 'RWD', 'AWD']),
  bodyStyle: z.string().optional(),
  numberOfDoors: z.number().int().positive(),
  fuelType: z.string().optional(),
  manufacturerName: z.string().optional(),
  plantCountry: z.string().optional(),
  plantCity: z.string().optional(),
  gvwrClass: z.string().optional(),
  engineDisplacement: z.number().optional(),
  numberOfCylinders: z.number().optional(),
  lastDetailingDate: z.date().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export const VehicleInformationForm: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  const [vinData, setVinData] = useState<Partial<VehicleFormData>>({});
  const decodeVIN = useMutation(api.vehicles.decodeVIN);
  const { data: detailingPackages } = useQuery(api.services.getDetailingPackages, { vehicleType: vinData.bodyStyle });

  const onSubmit = async (data: VehicleFormData) => {
    // Handle form submission
  };

  const handleVINScan = async (vin: string) => {
    const decodedData = await decodeVIN({ vin });
    setVinData(decodedData);
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      // Optimistically update the UI
      setVinData(data);
      await createVehicle(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const { data: userVehicles } = useQuery(api.vehicles.getUserVehicles, { userId: 'currentUserId' });
  const { data: detailingPackages } = useQuery(api.services.getDetailingPackages, { vehicleType: vinData.bodyStyle });

  // TODO: Add Tailwind CSS classes to ensure responsiveness

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="detailingPackages">Detailing Packages</Label>
            <select id="detailingPackages" {...register('detailingPackage')}>
              <option value="">Select a package</option>
              {detailingPackages.map(package => (
                <option key={package.id} value={package.id}>{package.name}</option>
              ))}
            </select>
            <div>
              <Label htmlFor="previousVehicles">Previously Entered Vehicles</Label>
              <select id="previousVehicles" onChange={(e) => setVinData(userVehicles.find(v => v.vin === e.target.value))}>
                <option value="">Select a vehicle</option>
                {userVehicles.map(vehicle => (
                  <option key={vehicle.vin} value={vehicle.vin}>{vehicle.make} {vehicle.model} ({vehicle.year})</option>
                ))}
              </select>
              <Card className="w-full max-w-lg mx-auto p-4 md:p-8">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Vehicle Information</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="vin" className="block text-sm md:text-base">VIN</Label>
                      <VINScanner onScan={handleVINScan} />
                      <Input id="vin" {...register('vin')} defaultValue={vinData.vin} className="w-full p-2 md:p-3" />
                      {errors.vin && <p className="text-red-500 text-sm">{errors.vin.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="make" className="block text-sm md:text-base">Make</Label>
                      <AutocompleteInput query={api.vehicles.getVehicleMakes} register={register} name="make" placeholder="Enter vehicle make" />
                      {errors.make && <p className="text-red-500 text-sm">{errors.make.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="model" className="block text-sm md:text-base">Model</Label>
                      <AutocompleteInput query={api.vehicles.getVehicleModels} register={register} name="model" placeholder="Enter vehicle model" />
                      {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="year" className="block text-sm md:text-base">Year</Label>
                      <Input id="year" type="number" {...register('year', { valueAsNumber: true })} defaultValue={vinData.year} className="w-full p-2 md:p-3" />
                      {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
                    </div>
                    {/* Add other fields similarly */}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full md:w-auto">Submit</Button>
                  </CardFooter>
                </form>
              </Card>
