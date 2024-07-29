// app/[organizationSlug]/self-assessment/page.tsx

import React from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { AIEstimation } from '@/components/AI/AIEstimation';
import { useDropzone } from 'react-dropzone';
import { Progress } from "@/components/ui/progress"
import Spinner from '@/components/SpinnerComponent';
import { Id } from '@/convex/_generated/dataModel';
import { Console } from 'winston/lib/winston/transports';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const selfAssessmentSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),
  selectedServices: z.array(z.string()).min(1, 'Select at least one service'),
  images: z.array(
    z.object({
      file: z.instanceof(File)
        .refine(file => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
        .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Only .jpg, .png, and .webp files are accepted.'),
    })
  ).max(5, 'You can upload up to 5 images'),
});

type SelfAssessmentFormData = z.infer<typeof selfAssessmentSchema>;
type CustomSelectProps = SelectProps & {
  id: string;
};
export default function SelfAssessmentPage() {
  const { organization } = useOrganization();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SelfAssessmentFormData>({
    resolver: zodResolver(selfAssessmentSchema),
    defaultValues: {
      condition: 'Good',
      selectedServices: [],
      images: [],
    },
  });

  const services = useQuery(api.services.listServices,
    organization?.id ? { tenantId: organization.id as Id<"organization"> } : 'skip'
  );

  const createSelfAssessment = useMutation(api.assessment.createAssessment);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setValue('images', acceptedFiles.map(file => ({ file })), { shouldValidate: true });
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ACCEPTED_IMAGE_TYPES },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 5,
  });

  const [selfAssessmentId, setSelfAssessmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data: SelfAssessmentFormData) => {
    if (!organization) {
      toast({ title: 'Error', description: 'Organization not found', variant: 'destructive' });
      return;
    }

    try {
      const yearInteger = parseInt(data.year, 10);
      const result = await createSelfAssessment({
        tenantId: organization.id as Id<"organization">,
        userId: organization.id as Id<"user">,
        vehicleId: organization.id as Id<"vehicle">,
        serviceId: organization.id as Id<"service">,
        selfAssessmentId: organization.id as Id<"selfAssessment">,
        organizationId: organization.id,
        vehicleDetails: {
          make: data.make,
          model: data.model,
          year: yearInteger, // Ensure year is parsed as an integer
          condition: data.condition,
          vin: '',
          color: '',
          bodyType: ''
        },
        selectedServices: data.selectedServices.map((serviceId: string) => serviceId as Id<"services">), // Convert string array to Id<"services"> array
        images: data.images.map(img => img.file),
      });
      setSelfAssessmentId(result);
      toast({ title: 'Success', description: 'Self-assessment submitted successfully' });
    } catch (error) 
    {
      console.error (
      ('Error submitting self-assessment:', error);
            toast({ title: 'Error', description: 'Failed to submit self-assessment. Please try again.', variant: 'destructive' }));
    }
  };
  if (!services) return <div> <Spinner />...</div>;

  const watchedFields = watch();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Self-Assessment</CardTitle>
      </CardHeader>
      <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Controller
                name="make"
                control={control}
                render={({ field }) => <Input id="make" {...field} aria-invalid={errors.make ? 'true' : 'false'} />}
              />
              {errors.make && <p className="text-red-500">{errors.make.message}</p>}
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Controller
                name="model"
                control={control}
                render={({ field }) => <Input id="model" {...field} aria-invalid={errors.model ? 'true' : 'false'} />}
              />
              {errors.model && <p className="text-red-500">{errors.model.message}</p>}
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => <Input id="year" {...field} aria-invalid={errors.year ? 'true' : 'false'} />}
              />
              {errors.year && <p className="text-red-500">{errors.year.message}</p>}
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <Select id="condition" {...field}>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Select Services</Label>
              <div className="space-y-2">
                {services.map(service => (
                  <div key={service._id} className="flex items-center space-x-2">
                    <Controller
                      name="selectedServices"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={service._id}
                          checked={field.value.includes(service._id)}
                          onCheckedChange={(checked) => {
                            const updatedServices = checked
                              ? [...field.value, service._id]
                              : field.value.filter(id => id !== service._id);
                            field.onChange(updatedServices);
                          }}
                        />
                      )}
                    />
                    <Label htmlFor={service._id}>{service.name}</Label>
                  </div>
                ))}
              </div>
              {errors.selectedServices && <p className="text-red-500">{errors.selectedServices.message}</p>}
            </div>
            <div>
              <Label>Upload Images</Label>
              <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
              {errors.images && <p className="text-red-500">{errors.images.message}</p>}
              {watchedFields.images.length > 0 && (
                <ul className="mt-2">
                  {watchedFields.images.map((file, index) => (
                    <li key={index}>{file.file.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <Button type="submit">Submit Assessment</Button>
          </form>
          {selfAssessmentId && <AIEstimation selfAssessmentId={selfAssessmentId} />}
      </CardContent>
    </Card>
  );
}

function useState<T>(arg0: null): [any, any] {
  throw new Error('Function not implemented.');
}
