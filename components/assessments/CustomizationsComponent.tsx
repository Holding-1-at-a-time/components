// components/assessments/CustomizationComponent.tsx

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Customizations: React.FC = () => {
  const { register, watch, setValue } = useFormContext();
  const [newCustomization, setNewCustomization] = useState('');
  const customizations = watch('customizations');

  const handleAddCustomization = () => {
    if (newCustomization.trim()) {
      setValue('customizations', [...customizations, { name: newCustomization, price: 0 }]);
      setNewCustomization('');
    }
  };

  
  return (
    <div className="grid gap-4 zoom-in">
      <Label className="font-semibold text-foreground">Customizations</Label>
      <p className="text-sm text-muted-foreground">Add any additional customizations to your order.</p>
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Input
            id="customization"
            value={newCustomization}
            onChange={(e) => setNewCustomization(e.target.value)}
            placeholder="Add customization"
            className="bg-background text-foreground border-border"
          />
          <Button onClick={handleAddCustomization} className="bg-primary text-primary-foreground hover:bg-primary-dark">
            Add
          </Button>
        </div>
        {customizations.map((customization: any, index: React.Key | null | undefined) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              {...register(`customizations.${index}.name`)}
              className="flex-grow bg-background text-foreground border-border"
            />
            <Input
              type="number"
              {...register(`customizations.${index}.price`, { valueAsNumber: true })}
              className="w-24 bg-background text-foreground border-border"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customizations;