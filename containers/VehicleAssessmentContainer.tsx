// Manages state and data for the form.

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react';
import Customizations from '../components/assessments/CustomizationsComponent';
import FileUploads from '../components/assessments/FileUploadsComponent';
import ServiceSelection from '../components/assessments/ServiceSelectionComponent';
import VehicleDetailsForm from '../components/assessments/VehicleDetailsFormComponent';
import { api } from '../convex/_generated/api';

const VehicleAssessmentContainer: React.FC = () => {
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    color: '',
    bodyType: '',
    condition: '',
  });
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const [customizations, setCustomizations] = useState<{ name: string; price: number }[]>([]);
  const [newCustomization, setNewCustomization] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = useQuery(api.services.listServices) || [];
  const createAssessment = useMutation(api.assessments.createAssessment);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handleAddCustomization = () => {
    if (newCustomization.trim()) {
      setCustomizations([...customizations, { name: newCustomization, price: 0 }]);
      setNewCustomization('');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages([...images, ...files]);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setVideos([...videos, ...files]);
  };

  const calculateTotal = () => {
    let total = 0;
    services.forEach((service) => {
      if (selectedServices[service._id]) {
        total += service.basePrice;
      }
    });
    customizations.forEach((customization) => {
      total += customization.price;
    });
    return total;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const assessmentData = services
        .filter((service) => selectedServices[service._id])
        .map((service) => ({
          serviceId: service._id,
          vehicleYear: parseInt(vehicleDetails.year),
          vehicleMake: vehicleDetails.make,
          vehicleModel: vehicleDetails.model,
          vehicleColor: vehicleDetails.color,
          vehicleLicensePlate: '',
          vehicleVin: vehicleDetails.vin,
          vehicleBodyType: vehicleDetails.bodyType,
        }));

      await createAssessment({
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientAddress: '123 Main St',
        images: images.map((img) => img.name).join(','),
        notes: customizations.map((c) => c.name).join(', '),
        vehicleId: 'temp_vehicle_id',
        videoUrl: videos.map((vid) => vid.name).join(','),
        imageUrl: images.map((img) => img.name).join(','),
        assessmentData,
      });

      toast({
        title: 'Assessment Submitted',
        description: 'Your vehicle assessment has been successfully submitted.',
      });
    } catch (error) {
      Console.error('Error submitting assessment:', error);
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting your assessment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl shadow-3d-light hover:shadow-3d-dark transition-transform transform hover:scale-105 p-6 bg-gradient-to-br from-primary to-secondary rounded-xl">
      <CardHeader className="flex flex-col items-start space-y-2">
        <CardTitle className="text-2xl font-bold text-white">Vehicle Assessment Details</CardTitle>
        <CardDescription className="text-sm text-gray-200">
          Customize your detailing order and get a transparent price estimate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <VehicleDetailsForm vehicleDetails={vehicleDetails} setVehicleDetails={setVehicleDetails} />
        <ServiceSelection services={services} selectedServices={selectedServices} onToggle={handleServiceToggle} />
        <Customizations
          customizations={customizations}
          newCustomization={newCustomization}
          onCustomizationChange={setNewCustomization}
          onAddCustomization={handleAddCustomization}
        />
        <FileUploads images={images} videos={videos} onImageUpload={handleImageUpload} onVideoUpload={handleVideoUpload} />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-gray-200">
          Estimated Total: <span className="font-medium text-white">${calculateTotal().toFixed(2)}</span>
        </div>
        <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="text-white border-white">
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleAssessmentContainer;
