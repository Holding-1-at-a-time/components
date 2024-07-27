// Handles input fields for vehicle details.

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VehicleDetailsFormProps {
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    vin: string;
    color: string;
    bodyType: string;
    condition: string;
  };
  setVehicleDetails: React.Dispatch<React.SetStateAction<{
    make: string;
    model: string;
    year: string;
    vin: string;
    color: string;
    bodyType: string;
    condition: string;
  }>>;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({ vehicleDetails, setVehicleDetails }) => {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="make" className="text-white">Make</Label>
          <Input
            id="make"
            placeholder="Enter vehicle make"
            value={vehicleDetails.make}
            onChange={(e) => setVehicleDetails({ ...vehicleDetails, make: e.target.value })}
            className="text-black"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model" className="text-white">Model</Label>
          <Input
            id="model"
            placeholder="Enter vehicle model"
            value={vehicleDetails.model}
            onChange={(e) => setVehicleDetails({ ...vehicleDetails, model: e.target.value })}
            className="text-black"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="year" className="text-white">Year</Label>
          <Input
            id="year"
            type="number"
            placeholder="Enter vehicle year"
            value={vehicleDetails.year}
            onChange={(e) => setVehicleDetails({ ...vehicleDetails, year: e.target.value })}
            className="text-black"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vin" className="text-white">VIN</Label>
          <Input
            id="vin"
            placeholder="Enter vehicle VIN"
            value={vehicleDetails.vin}
            onChange={(e) => setVehicleDetails({ ...vehicleDetails, vin: e.target.value })}
            className="text-black"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="color" className="text-white">Color</Label>
          <Input
            id="color"
            placeholder="Enter vehicle color"
            value={vehicleDetails.color}
            onChange={(e) => setVehicleDetails({ ...vehicleDetails, color: e.target.value })}
            className="text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsForm;
