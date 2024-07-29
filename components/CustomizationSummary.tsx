import React from 'react';
import { Customization } from '@/types';

interface CustomizationSummaryProps {
  customizations: Customization[];
}

export const CustomizationSummary: React.FC<CustomizationSummaryProps> = ({ customizations }) => {
  return (
    <ul className="list-disc list-inside space-y-2">
      {customizations.map((customization) => (
        <li key={customization.id}>
          {customization.name} - ${customization.price.toFixed(2)}
        </li>
      ))}
    </ul>
  );
};