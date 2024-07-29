import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VehicleDetailsForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid gap-6 fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="make" className="text-foreground">Make</Label>
          <Input
            id="make"
            {...register("vehicleDetails.make")}
            placeholder="Enter vehicle make"
            className="bg-background text-foreground border-border"
          />
          {errors.vehicleDetails?.make && (
            <p className="text-destructive text-sm">{errors.vehicleDetails.make.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model" className="text-foreground">Model</Label>
          <Input
            id="model"
            {...register("vehicleDetails.model")}
            placeholder="Enter vehicle model"
            className="bg-background text-foreground border-border"
          />
          {errors.vehicleDetails?.model && (
            <p className="text-destructive text-sm">{errors.vehicleDetails.model.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="year" className="text-foreground">Year</Label>
          <Input
            id="year"
            type="number"
            {...register("vehicleDetails.year")}
            placeholder="Enter vehicle year"
            className="bg-background text-foreground border-border"
          />
          {errors.vehicleDetails?.year && (
            <p className="text-destructive text-sm">{errors.vehicleDetails.year.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vin" className="text-foreground">VIN</Label>
          <Input
            id="vin"
            {...register("vehicleDetails.vin")}
            placeholder="Enter vehicle VIN"
            className="bg-background text-foreground border-border"
          />
          {errors.vehicleDetails?.vin && (
            <p className="text-destructive text-sm">{errors.vehicleDetails.vin.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="color" className="text-foreground">Color</Label>
          <Input
            id="color"
            {...register("vehicleDetails.color")}
            placeholder="Enter vehicle color"
            className="bg-background text-foreground border-border"
          />
          {errors.vehicleDetails?.color && (
            <p className="text-destructive text-sm">{errors.vehicleDetails.color.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="bodyType" className="text-foreground">Body Type</Label>
          <Input
            id="bodyType"
            {...register("vehicleDetails.bodyType")}
            placeholder="Enter body type"
            className="bg-background text-foreground border-border"
          />
          {errors.vehicleDetails?.bodyType && (
            <p className="text-destructive text-sm">{errors.vehicleDetails.bodyType.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="condition" className="text-foreground">Condition</Label>
          <Select {...register("vehicleDetails.condition")}>
            <SelectTrigger className="bg-background text-foreground border-border">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {errors.vehicleDetails?.condition && (
            <p className="text-destructive text-sm">{errors.vehicleDetails.condition.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsForm;