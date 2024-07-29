import React, { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import VehicleDetailsForm from '@/components/form/VehicleDetailsFormComponent';
import ServiceSelection from '@/components/assessments/ServiceSelectionComponent';
import FileUploads from '@/components/assessments/FileUploadsComponent';
import Customizations from '@/components/assessments/CustomizationsComponent';
import { AIEstimation } from '@/components/AI/AIEstimation';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentSchema, AssessmentFormData } from '@/lib/schema';

export default function VehicleAssessmentContainer() {
  const { organization } = useOrganization();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAssessment = useMutation(api.assessments.createAssessment);
  const services = useQuery(api.services.listServices, 
    organization?.id ? { orgId: organization.id } : 'skip'
  );

  const methods = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      vehicleDetails: {
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        color: '',
        bodyType: '',
        condition: 'Good',
      },
      selectedServices: {},
      customizations: [],
      images: [],
      videos: [],
    },
  });

  const { handleSubmit, watch } = methods;
  const watchedFields = watch();

  const onSubmit = async (data: AssessmentFormData) => {
    if (!organization) {
      toast({
        title: "Error",
        description: "No organization selected.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const assessmentData = {
        organizationId: organization.id,
        vehicleDetails: data.vehicleDetails,
        selectedServices: Object.keys(data.selectedServices).filter(key => data.selectedServices[key]),
        customizations: data.customizations,
        images: data.images,
        videos: data.videos,
      };

      const assessmentId = await createAssessment(assessmentData);

      toast({
        title: 'Assessment Submitted',
        description: 'Your vehicle assessment has been successfully submitted.',
      });

      router.push(`/${organization.slug}/assessment/${assessmentId}`);
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

  if (services === undefined) {
    return <div>Loading...</div>;
  }

  if (services === null) {
    return <div>Error loading services. Please try again.</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-4xl shadow-3d-light hover:shadow-3d-dark transition-transform transform hover:scale-105 p-6 bg-gradient-to-br from-primary to-secondary rounded-xl">
          <CardHeader className="flex flex-col items-start space-y-2">
            <CardTitle className="text-2xl font-bold text-white">Vehicle Assessment Details</CardTitle>
            <CardDescription className="text-sm text-gray-200">
              Customize your detailing order and get a transparent price estimate.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <VehicleDetailsForm />
            <ServiceSelection services={services} />
            <Customizations />
            <FileUploads />
            <AIEstimation
              vehicleDetails={watchedFields.vehicleDetails}
              selectedServices={services.filter(s => watchedFields.selectedServices[s._id])}
              customizations={watchedFields.customizations}
              uploadedFiles={[...watchedFields.images, ...watchedFields.videos]}
            />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button 
              type="submit"
              size="lg" 
              className="text-white border-white hover:bg-primary-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}