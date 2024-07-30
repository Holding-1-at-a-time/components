import DOMPurify from 'dompurify';
import React from 'react';
import { Service } from '@/types';
import { AIEstimation } from './AI/AIEstimation';
import { FileGallery } from './FileGallery';

interface ServiceSummaryProps {
  services: Service[];
}

export const ServiceSummary: React.FC<ServiceSummaryProps> = React.memo(({ services }) => {
  if (!services) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <ul className="list-disc list-inside space-y-2">
        {services.map((service) => (
          <ServiceListItem key={service.id} service={service} />
        ))}
      </ul>
    </div>
  );
});

const ServiceListItem: React.FC<{ service: Service }> = ({ service }) => (
  <li>
    {DOMPurify.sanitize(service.description)}
    {DOMPurify.sanitize(service.name)} - ${service.price.toFixed(2)}
    {service.notes && <p className="text-sm text-gray-500">{DOMPurify.sanitize(service.notes)}</p>}
    {service.estimate && <AIEstimation estimate={service.estimate} />}
    {service.files && <FileGallery files={service.files} />}
    {service.customizations && <CustomizationSummary customizations={service.customizations} />}
    {service.services && <ServiceSummary services={service.services} />}
  </li>
);

interface CustomizationSummaryProps {
  customizations: string[];
}

export const CustomizationSummary: React.FC<CustomizationSummaryProps> = React.memo(({ customizations }) => {
  // CustomizationSummary component logic here
});
