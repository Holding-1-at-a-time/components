// Handles the selection of services.

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ServiceSelectionProps {
  services: { _id: string; description: string; basePrice: number }[];
  selectedServices: Record<string, boolean>;
  onToggle: (serviceId: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ services, selectedServices, onToggle }) => {
  return (
    <div className="grid gap-4">
      <Label className="font-semibold text-white">Detailing Services</Label>
      <p className="text-sm text-gray-200">Select the services you would like to add to your order.</p>
      {services.map((service) => (
        <div key={service._id} className="flex items-center gap-2">
          <Checkbox
            id={service._id}
            checked={selectedServices[service._id] || false}
            onCheckedChange={() => onToggle(service._id)}
            className="text-white"
          />
          <Label htmlFor={service._id} className="text-sm font-normal text-white">
            {service.description}
          </Label>
          <div className="ml-auto text-sm font-medium text-white">${service.basePrice.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};

export default ServiceSelection;
