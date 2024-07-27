// Handles customizations input and display.

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomizationsProps {
  customizations: { name: string; price: number }[];
  newCustomization: string;
  onCustomizationChange: (value: string) => void;
  onAddCustomization: () => void;
}

const Customizations: React.FC<CustomizationsProps> = ({
  customizations,
  newCustomization,
  onCustomizationChange,
  onAddCustomization,
}) => {
  return (
    <div className="grid gap-4">
      <Label className="font-semibold text-white">Customizations</Label>
      <p className="text-sm text-gray-200">Add any additional customizations to your order.</p>
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Input
            id="customization"
            placeholder="Add customization"
            value={newCustomization}
            onChange={(e) => onCustomizationChange(e.target.value)}
            className="text-black"
          />
          <Button size="sm" onClick={onAddCustomization} className="text-white border-white">Add</Button>
        </div>
        {customizations.map((customization, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <div className="font-medium text-white">{customization.name}</div>
            </div>
            <div className="ml-auto text-sm font-medium text-white">${customization.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customizations;
