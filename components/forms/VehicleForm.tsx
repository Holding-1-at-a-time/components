import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().length(17, "VIN must be 17 characters"),
  licensePlate: z.string().min(1, "License plate is required"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onSubmit: SubmitHandler<VehicleFormData>;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="make">Make</Label>
            <Input id="make" {...register('make')} />
            {errors.make && <p className="text-red-500 text-sm">{errors.make.message}</p>}
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input id="model" {...register('model')} />
            {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" {...register('year', { valueAsNumber: true })} />
            {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
          </div>
          <div>
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" {...register('vin')} />
            {errors.vin && <p className="text-red-500 text-sm">{errors.vin.message}</p>}
          </div>
          <div>
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input id="licensePlate" {...register('licensePlate')} />
            {errors.licensePlate && <p className="text-red-500 text-sm">{errors.licensePlate.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Vehicle</Button>
        </CardFooter>
      </form>
    </Card>
  );
};