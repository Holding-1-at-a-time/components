import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Id } from '@/convex/_generated/dataModel';

interface Service {
  _id: Id<"services">;
  name: string;
  description: string;
  basePrice: number;
}

interface ServiceSelectionProps {
  services: Service[];
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ services }) => {
  const { register, watch } = useFormContext();
  const selectedServices = watch('selectedServices');

  return (
    <div className="grid gap-4 slide-in">
      <Label className="font-semibold text-foreground">Detailing Services</Label>
      <p className="text-sm text-muted-foreground">Select the services you would like to add to your order.</p>
      {services.map((service) => (
        <div key={service._id} className="flex items-center gap-2">
          <Checkbox
            id={service._id}
            {...register(`selectedServices.${service._id}`)}
            checked={selectedServices[service._id] || false}
            className="text-primary border-border"
          />
          <Label htmlFor={service._id} className="text-sm font-normal text-foreground flex-grow">
            {service.name} - {service.description}
          </Label>
          <div className="ml-auto text-sm font-medium text-foreground">${service.basePrice.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};

export default ServiceSelection;