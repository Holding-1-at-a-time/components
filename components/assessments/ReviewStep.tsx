import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VehicleDetails, Service, Customization, Hotspot, UploadedFile } from '@/types';

interface ReviewStepProps {
  vehicleDetails: VehicleDetails;
  selectedServices: Service[];
  customizations: Customization[];
  hotspots: Hotspot[];
  images: UploadedFile[];
  videos: UploadedFile[];
  estimatedTotal?: number;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ vehicleDetails, selectedServices, customizations, hotspots, images, videos, estimatedTotal }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3>Vehicle Details</h3>
          <p>Make: {vehicleDetails.make}</p>
          <p>Model: {vehicleDetails.model}</p>
          <p>Year: {vehicleDetails.year}</p>
          <p>Condition: {vehicleDetails.condition}</p>
        </div>
        <div>
          <h3>Selected Services</h3>
          <ul>
            {selectedServices.map(service => (
              <li key={service._id}>{service.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Customizations</h3>
          <ul>
            {customizations.map((customization, index) => (
              <li key={index}>{customization.name}: ${customization.price}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Reported Issues</h3>
          <ul>
            {hotspots.map((hotspot, index) => (
              <li key={index}>{hotspot.part}: {hotspot.issue}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Uploaded Files</h3>
          <p>Images: {images.length}</p>
          <p>Videos: {videos.length}</p>
        </div>
        {estimatedTotal && (
          <div>
            <h3>Estimated Total</h3>
            <p>${estimatedTotal.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewStep;