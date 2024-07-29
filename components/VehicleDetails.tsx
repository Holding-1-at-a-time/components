import React from 'react';
import { VehicleDetails as VehicleDetailsType } from '@/types';

interface VehicleDetailsProps {
  vehicleDetails: VehicleDetailsType;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicleDetails }) => {
  return (
    <div className="space-y-2">
      <p><strong>Make:</strong> {vehicleDetails.make}</p>
      <p><strong>Model:</strong> {vehicleDetails.model}</p>
      <p><strong>Year:</strong> {vehicleDetails.year}</p>
      <p><strong>VIN:</strong> {vehicleDetails.vin}</p>
      <p><strong>Color:</strong> {vehicleDetails.color}</p>
      <p><strong>Body Type:</strong> {vehicleDetails.bodyType}</p>
      <p><strong>Mileage:</strong> {vehicleDetails.mileage}</p>
      <p><strong>Transmission:</strong> {vehicleDetails.transmission}</p>
      <p><strong>Engine:</strong> {vehicleDetails.engine}</p>
      <p><strong>Drivetrain:</strong> {vehicleDetails.drivetrain}</p>
      <p><strong>Accessories:</strong> {vehicleDetails.accessories.join(', ')}</p>
      <p><strong>Interior:</strong> {vehicleDetails.interior}</p>
      <p><strong>Exterior:</strong> {vehicleDetails.exterior}</p>
      <p><strong>Options:</strong> {vehicleDetails.options.join(', ')}</p>
      <p><strong>Condition:</strong> {vehicleDetails.condition}</p>
      <p><strong>Description:</strong> {vehicleDetails.description}</p>
      <p><strong>Tags:</strong> {vehicleDetails.tags.join(', ')}</p>
      <p><strong>Location:</strong> {vehicleDetails.location}</p>
      <p><strong>Price:</strong> {vehicleDetails.price}</p>
      <p><strong>Images:</strong> {vehicleDetails.images.join(', ')}</p>
      <p><strong>Video:</strong> {vehicleDetails.video}</p>
      <p><strong>Customizations:</strong> {vehicleDetails.customizations.join(', ')}</p>
      <p><strong>Uploaded Files:</strong> {vehicleDetails.uploadedFiles.join(', ')}</p>
      <p><strong>Services:</strong> {vehicleDetails.services.join(', ')}</p>
      <p><strong>Notes:</strong> {vehicleDetails.notes}</p>
      <p><strong>Created At:</strong> {vehicleDetails.createdAt}</p>
      <p><strong>Updated At:</strong> {vehicleDetails.updatedAt}</p>
      <p><strong>Deleted At:</strong> {vehicleDetails.deletedAt}</p>
      <p><strong>Deleted By:</strong> {vehicleDetails.deletedBy}</p>
      <p><strong>Deleted Reason:</strong> {vehicleDetails.deletedReason}</p>
      <p><strong>Status:</strong> {vehicleDetails.status}</p>
      <p><strong>Created By:</strong> {vehicleDetails.createdBy}</p>
      <p><strong>Updated By:</strong> {vehicleDetails.updatedBy}</p>
    </div>
  );
};