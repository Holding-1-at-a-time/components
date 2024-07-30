"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery, useMutation, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { VINScanner } from '@/components/VINScanner';
import { VehicleHotspotAssessment } from '@/components/assessments/VehicleHotspotAssessmentComponent';
import { ServiceSelection } from '@/components/assessments/ServiceSelectionComponent';
import { Customizations } from '@/components/assessments/CustomizationsComponent';
import { FileUploads } from '@/components/FileUploadsComponent';
import { ReviewStep } from '@/components/ReviewStep';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { selfAssessmentSchema, SelfAssessmentFormData } from '@/lib/schemas';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { Id } from '@/convex/_generated/dataModel';
import { logger } from '@/lib/logger';

const STEPS = ['vehicleDetails', 'conditionAssessment', 'serviceSelection', 'fileUpload', 'review'] as const;
type Step = typeof STEPS[number];

export default function SelfAssessmentPage() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const t = useTranslations('SelfAssessment');
  const router = useRouter();
  const convex = useConvex();
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState<Step>('vehicleDetails');

  const methods = useForm<SelfAssessmentFormData>({
    resolver: zodResolver(selfAssessmentSchema),
    defaultValues: {
      condition: 'Good',
      hotspotAssessment: [],
      selectedServices: [],
      customizations: [],
      images: [],
      videos: [],
    },
  });

  const { handleSubmit, setValue, getValues, formState: { isDirty, errors } } = methods;

  useUnsavedChangesWarning(isDirty);

  const { data: services, isLoading, error } = useQuery(api.services.listServices, 
    organization?.id ? { tenantId: organization.id as Id<"organization"> } : 'skip'
  );

  const createSelfAssessment = useMutation(api.selfAssessments.createSelfAssessment);

  const handleVINScan = useCallback((vinData: any) => {
    setValue('make', vinData.make, { shouldValidate: true });
    setValue('model', vinData.model, { shouldValidate: true });
    setValue('year', vinData.year.toString(), { shouldValidate: true });
    setValue('vin', vinData.vin, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: SelfAssessmentFormData) => {
    if (!organization?.id || !user?.id) {
      toast({ title: t('error'), description: t('organizationNotFound'), variant: 'destructive' });
      return;
    }

    try {
      const result = await createSelfAssessment({
        organizationId: organization.id as Id<"organization">,
        userId: user.id as Id<"user">,
        vehicleDetails: {
          make: data.make,
          model: data.model,
          year: data.year,
          condition: data.condition,
          vin: data.vin,
        },
        selectedServices: data.selectedServices.map(id => id as Id<"services">),
        customizations: data.customizations,
        images: data.images.map(img => img.url),
        videos: data.videos.map(video => video.url),
        hotspotAssessment: data.hotspotAssessment,
      });
      
      toast({ title: t('success'), description: t('assessmentSubmitted') });
      trackEvent('SelfAssessmentSubmitted', { organizationId: organization.id });
      router.push(`/${organization.slug}/assessments/${result}`);
    } catch (error) {
      logger.error('Error submitting self-assessment:', { error, userId: user.id, organizationId: organization.id });
      toast({ title: t('error'), description: t('submissionFailed'), variant: 'destructive' });
    }
  };

  const validateStep = useCallback((step: Step): boolean => {
    const stepFields = {
      vehicleDetails: ['make', 'model', 'year', 'vin'],
      conditionAssessment: ['condition', 'hotspotAssessment'],
      serviceSelection: ['selectedServices'],
      fileUpload: ['images', 'videos'],
      review: [],
    };

    return stepFields[step].every(field => !errors[field]);
  }, [errors]);

  const handleStepChange = useCallback((newStep: Step) => {
    if (validateStep(currentStep)) {
      setCurrentStep(newStep);
      trackEvent('SelfAssessmentStepChanged', { step: newStep });
    } else {
      toast({ title: t('error'), description: t('pleaseFixErrors'), variant: 'destructive' });
    }
  }, [currentStep, validateStep, trackEvent, t]);

  useEffect(() => {
    if (!organization?.id) {
      router.push('/organization-selection');
    }
  }, [organization, router]);

  if (isLoading) return <Spinner aria-label={t('loading')} />;
  if (error) return <div role="alert">{t('errorLoadingServices', { error: error.message })}</div>;
  if (!services?.length) return <div role="alert">{t('noServicesFound')}</div>;

  const stepComponents: Record<Step, React.ReactNode> = {
    vehicleDetails: <VINScanner onScan={handleVINScan} />,
    conditionAssessment: <VehicleHotspotAssessment onAssessment={(assessment) => setValue('hotspotAssessment', assessment, { shouldValidate: true })} />,
    serviceSelection: <ServiceSelection services={services} />,
    fileUpload: <FileUploads />,
    review: <ReviewStep onEdit={() => handleStepChange('vehicleDetails')} onSubmit={handleSubmit(onSubmit)} />,
  };

  return (
    <ErrorBoundary>
      <FormProvider {...methods}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('vehicleSelfAssessment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressIndicator currentStep={STEPS.indexOf(currentStep)} totalSteps={STEPS.length} />
            {stepComponents[currentStep]}
            <div className="mt-4 flex justify-between">
              {currentStep !== 'vehicleDetails' && (
                <Button onClick={() => handleStepChange(STEPS[STEPS.indexOf(currentStep) - 1] as Step)}>
                  {t('previous')}
                </Button>
              )}
              {currentStep !== 'review' && (
                <Button onClick={() => handleStepChange(STEPS[STEPS.indexOf(currentStep) + 1] as Step)}>
                  {t('next')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </FormProvider>
    </ErrorBoundary>
  );
}