import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import VINScanner from '@/components/VINScanner'; // Import VINScanner component

interface Service {
  _id: Id<'services'>;
  name: string;
  basePrice: number;
}

interface ClientAssessmentFormProps {
  tenantId: Id<'organizations'>;
}

const ClientAssessmentForm: React.FC<ClientAssessmentFormProps> = ({ tenantId }) => {
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    exteriorColor: '',
    interiorColor: '',
    modifications: '',
    lastDetailingDate: '',
  });
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const services = useQuery(api.services.listByTenant, { tenantId }) || [];
  const createAssessment = useMutation(api.assessments.create);

  const handleVehicleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleDetails({ ...vehicleDetails, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (serviceId: Id<'services'>) => {
    setSelectedServices(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  const handleCustomizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCustomizations(prev => [...prev, value]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(e.target.files || []);
    if (type === 'image') {
      setImages(prev => [...prev, ...files]);
    } else {
      setVideos(prev => [...prev, ...files]);
    }
  };

  const calculateEstimate = () => {
    return services.reduce((total, service) => {
      if (selectedServices[service._id]) {
        return total + service.basePrice;
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssessment({
        tenantId,
        vehicleDetails,
        selectedServices: Object.entries(selectedServices)
          .filter(([, isSelected]) => isSelected)
          .map(([serviceId]) => serviceId as Id<'services'>),
        customizations,
        images,
        videos,
      });
      alert('Assessment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Detailing Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input id="make" name="make" value={vehicleDetails.make} onChange={handleVehicleDetailChange} required />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" value={vehicleDetails.model} onChange={handleVehicleDetailChange} required />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" type="number" value={vehicleDetails.year} onChange={handleVehicleDetailChange} required />
            </div>
            <div>
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" name="vin" value={vehicleDetails.vin} onChange={handleVehicleDetailChange} />
              <VINScanner onVINDecoded={(info) => setVehicleDetails({ ...vehicleDetails, ...info })} />
            </div>
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input id="mileage" name="mileage" type="number" value={vehicleDetails.mileage} onChange={handleVehicleDetailChange} />
            </div>
            <div>
              <Label htmlFor="exteriorColor">Exterior Color</Label>
              <Input id="exteriorColor" name="exteriorColor" value={vehicleDetails.exteriorColor} onChange={handleVehicleDetailChange} />
            </div>
            <div>
              <Label htmlFor="interiorColor">Interior Color</Label>
              <Input id="interiorColor" name="interiorColor" value={vehicleDetails.interiorColor} onChange={handleVehicleDetailChange} />
            </div>
            <div>
              <Label htmlFor="modifications">Modifications</Label>
              <Input id="modifications" name="modifications" value={vehicleDetails.modifications} onChange={handleVehicleDetailChange} />
            </div>
            <div>
              <Label htmlFor="lastDetailingDate">Last Detailing Date</Label>
              <Input id="lastDetailingDate" name="lastDetailingDate" type="date" value={vehicleDetails.lastDetailingDate} onChange={handleVehicleDetailChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Services</Label>
            {services.map((service) => (
              <div key={service._id} className="flex items-center space-x-2">
                <Checkbox id={service._id} checked={selectedServices[service._id] || false} onCheckedChange={() => handleServiceToggle(service._id)} />
                <Label htmlFor={service._id}>{service.name} - ${service.basePrice.toFixed(2)}</Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Customizations</Label>
            <Input id="customizations" name="customizations" value={customizations.join(', ')} onChange={handleCustomizationChange} />
          </div>
          <div className="space-y-2">
            <Label>Upload Photos</Label>
            <Input id="images" name="images" type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'image')} />
          </div>
          <div className="space-y-2">
            <Label>Upload Videos</Label>
            <Input id="videos" name="videos" type="file" accept="video/*" multiple onChange={(e) => handleFileUpload(e, 'video')} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>Estimated Total: ${calculateEstimate().toFixed(2)}</div>
        <Button type="submit" onClick={handleSubmit}>Submit Assessment</Button>
      </CardFooter>
    </Card>
  );
};

export default ClientAssessmentForm;