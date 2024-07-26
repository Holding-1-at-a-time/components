import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

export default function VehicleAssessmentForm() {
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    color: '',
    bodyType: '',
    condition: '',
  });
  const [selectedServices, setSelectedServices] = useState({});
  const [customizations, setCustomizations] = useState([]);
  const [newCustomization, setNewCustomization] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = useQuery(api.services.listServices) || [];
  const createAssessment = useMutation(api.assessments.createAssessment);

  const handleVINScan = async () => {
    toast({
      title: 'VIN Scanning',
      description: 'This feature is not implemented in this demo.',
    });
  };

  const handleServiceToggle = (serviceId) => {
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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
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
      console.error('Error submitting assessment:', error);
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
    <Card className='w-full max-w-4xl shadow-3d-light hover:shadow-3d-dark transition-transform transform hover:scale-105 p-6 bg-gradient-to-br from-primary to-secondary rounded-xl'>
      <CardHeader className='flex flex-col items-start space-y-2'>
        <CardTitle className='text-2xl font-bold text-white'>Vehicle Assessment Details</CardTitle>
        <CardDescription className='text-sm text-gray-200'>Customize your detailing order and get a transparent price estimate.</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='make' className='text-white'>Make</Label>
            <Input
              id='make'
              placeholder='Enter vehicle make'
              value={vehicleDetails.make}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, make: e.target.value })}
              className='text-black'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='model' className='text-white'>Model</Label>
            <Input
              id='model'
              placeholder='Enter vehicle model'
              value={vehicleDetails.model}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, model: e.target.value })}
              className='text-black'
            />
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='year' className='text-white'>Year</Label>
            <Input
              id='year'
              type='number'
              placeholder='Enter vehicle year'
              value={vehicleDetails.year}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, year: e.target.value })}
              className='text-black'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='vin' className='text-white'>VIN</Label>
            <div className='flex items-center gap-2'>
              <Input
                id='vin'
                placeholder='Enter vehicle VIN'
                value={vehicleDetails.vin}
                onChange={(e) => setVehicleDetails({ ...vehicleDetails, vin: e.target.value })}
                className='text-black'
              />
              <Button size='sm' variant='outline' onClick={handleVINScan} className='text-white border-white'>
                <CameraIcon className='h-4 w-4' />
                <span className='sr-only'>Scan VIN</span>
              </Button>
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='color' className='text-white'>Color</Label>
            <Input
              id='color'
              placeholder='Enter vehicle color'
              value={vehicleDetails.color}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, color: e.target.value })}
              className='text-black'
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='bodyType' className='text-white'>Body Type</Label>
            <Select
              id='bodyType'
              value={vehicleDetails.bodyType}
              onValueChange={(value) => setVehicleDetails({ ...vehicleDetails, bodyType: value })}
            >
              <SelectTrigger className='text-black'>
                <SelectValue placeholder='Select body type' />
              </SelectTrigger>
              <SelectContent className='text-black'>
                <SelectItem value='sedan'>Sedan</SelectItem>
                <SelectItem value='suv'>SUV</SelectItem>
                <SelectItem value='truck'>Truck</SelectItem>
                <SelectItem value='van'>Van</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='condition' className='text-white'>Current Condition</Label>
            <Select
              id='condition'
              value={vehicleDetails.condition}
              onValueChange={(value) => setVehicleDetails({ ...vehicleDetails, condition: value })}
            >
              <SelectTrigger className='text-black'>
                <SelectValue placeholder='Select condition' />
              </SelectTrigger>
              <SelectContent className='text-black'>
                <SelectItem value='excellent'>Excellent</SelectItem>
                <SelectItem value='good'>Good</SelectItem>
                <SelectItem value='fair'>Fair</SelectItem>
                <SelectItem value='poor'>Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator className='border-gray-200' />
        <div className='grid gap-4'>
          <div>
            <Label className='font-semibold text-white'>Detailing Services</Label>
            <p className='text-sm text-gray-200'>Select the services you would like to add to your order.</p>
          </div>
          <div className='grid gap-2'>
            {services.map((service) => (
              <div key={service._id} className='flex items-center gap-2'>
                <Checkbox
                  id={service._id}
                  checked={selectedServices[service._id] || false}
                  onCheckedChange={() => handleServiceToggle(service._id)}
                  className='text-white'
                />
                <Label htmlFor={service._id} className='text-sm font-normal text-white'>
                  {service.description}
                </Label>
                <div className='ml-auto text-sm font-medium text-white'>${service.basePrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='grid gap-4'>
          <div>
            <Label className='font-semibold text-white'>Customizations</Label>
            <p className='text-sm text-gray-200'>Add any additional customizations to your order.</p>
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2'>
              <Input
                id='customization'
                placeholder='Add customization'
                value={newCustomization}
                onChange={(e) => setNewCustomization(e.target.value)}
                className='text-black'
              />
              <Button size='sm' onClick={handleAddCustomization} className='text-white border-white'>Add</Button>
            </div>
            {customizations.map((customization, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div className='flex-1'>
                  <div className='font-medium text-white'>{customization.name}</div>
                </div>
                <div className='ml-auto text-sm font-medium text-white'>${customization.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='grid gap-4'>
          <div>
            <Label className='font-semibold text-white'>Upload Images/Videos</Label>
            <p className='text-sm text-gray-200'>
              Capture the current condition of your vehicle using your smartphone camera.
            </p>
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2'>
              <Button size='sm' variant='outline' onClick={() => document.getElementById('image-upload').click()} className='text-white border-white'>
                <CameraIcon className='h-4 w-4 mr-2' />
                Upload Images
              </Button>
              <input
                id='image-upload'
                type='file'
                accept='image/*'
                multiple
                onChange={handleImageUpload}
                className='hidden'
              />
              <Button size='sm' variant='outline' onClick={() => document.getElementById('video-upload').click()} className='text-white border-white'>
                <VideoIcon className='h-4 w-4 mr-2' />
                Upload Videos
              </Button>
              <input
                id='video-upload'
                type='file'
                accept='video/*'
                multiple
                onChange={handleVideoUpload}
                className='hidden'
              />
            </div>
            <div className='text-white'>
              <p>Images: {images.length} uploaded</p>
              <p>Videos: {videos.length} uploaded</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <div className='text-gray-200'>
          Estimated Total: <span className='font-medium text-white'>${calculateTotal().toFixed(2)}</span>
        </div>
        <Button size='lg' onClick={handleSubmit} disabled={isSubmitting} className='text-white border-white'>
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CameraIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' />
      <circle cx='12' cy='13' r='3' />
    </svg>
  );
}

function VideoIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5' />
      <rect x='2' y='6' width='14' height='12' rx='2' />
    </svg>
  );
}
