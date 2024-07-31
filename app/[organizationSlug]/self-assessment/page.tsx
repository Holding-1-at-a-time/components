// app/[organizationSlug]/self-assessment/page.tsx

import React, { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
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
import { VehicleConditionAssessment } from '@/components/assessments/VehicleConditionAssessment';
import { ServiceSelection } from '@/components/assessments/ServiceSelection';
import { CustomizationSelection } from '@/components/assessments/CustomizationSelection';
import { FileUpload } from '@/components/FileUpload';
import { AIEstimation } from '@/components/AIEstimation';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { selfAssessmentSchema, SelfAssessmentFormData } from '@/lib/schemas';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { Id } from '@/convex/_generated/dataModel';

const STEPS = ['vehicleInfo', 'condition', 'services', 'customizations', 'upload', 'aiEstimation', 'review'] as const;
type Step = typeof STEPS[number];

export default function SelfAssessmentPage() {
  const { organization } = useOrganization();
  const t = useTranslations('SelfAssessment');
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState<Step>('vehicleInfo');
  const [selfAssessmentId, setSelfAssessmentId] = useState<Id<'selfAssessments'> | null>(null);

  const methods = useForm<SelfAssessmentFormData>({
    resolver: zodResolver(selfAssessmentSchema),
    defaultValues: {
      vehicleInfo: {},
      condition: {},
      selectedServices: [],
      customizations: [],
      uploadedFiles: [],
    },
  });

  const { handleSubmit, watch, formState: { isDirty, isValid } } = methods;

  useUnsavedChangesWarning(isDirty);

  const createSelfAssessment = useMutation(api.selfAssessments.create);
  const updateSelfAssessment = useMutation(api.selfAssessments.update);

  const onSubmit = async (data: SelfAssessmentFormData) => {
    if (!organization?.id) {
      toast({ title: t('error'), description: t('organizationNotFound'), variant: 'destructive' });
      return;
    }

    try {
      let assessmentId: Id<'selfAssessments'>;
      if (selfAssessmentId) {
        await updateSelfAssessment({ id: selfAssessmentId, ...data });
        assessmentId = selfAssessmentId;
      } else {
        assessmentId = await createSelfAssessment({ organizationId: organization.id, ...data });
        setSelfAssessmentId(assessmentId);
      }
      
      toast({ title: t('success'), description: t('assessmentSubmitted') });
      trackEvent('SelfAssessmentSubmitted', { organizationId: organization.id });
      router.push(`/${organization.slug}/assessments/${assessmentId}`);
    } catch (error) {
      toast({ title: t('error'), description: t('submissionFailed'), variant: 'destructive' });
    }
  };

  const handleStepChange = (newStep: Step) => {
    setCurrentStep(newStep);
    trackEvent('SelfAssessmentStepChanged', { step: newStep });
  };

  const stepComponents: Record<Step, React.ReactNode> = {
    vehicleInfo: <VINScanner />,
    condition: <VehicleConditionAssessment />,
    services: <ServiceSelection />,
    customizations: <CustomizationSelection />,
    upload: <FileUpload />,
    aiEstimation: selfAssessmentId ? <AIEstimation selfAssessmentId={selfAssessmentId} /> : null,
    review: <ReviewStep onSubmit={handleSubmit(onSubmit)} />,
  };

  return (
    <ErrorBoundary fallback={<div role="alert">{t('errorOccurred')}</div>}>
      <FormProvider {...methods}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('vehicleSelfAssessment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressIndicator currentStep={STEPS.indexOf(currentStep)} totalSteps={STEPS.length} />
            {stepComponents[currentStep]}
            <div className="mt-4 flex justify-between">
              {currentStep !== 'vehicleInfo' && (
                <Button onClick={() => handleStepChange(STEPS[STEPS.indexOf(currentStep) - 1] as Step)}>
                  {t('previous')}
                </Button>
              )}
              {currentStep !== 'review' && (
                <Button 
                  onClick={() => handleStepChange(STEPS[STEPS.indexOf(currentStep) + 1] as Step)}
                  disabled={!isValid}
                >
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

function ReviewStep({ onSubmit }: { onSubmit: () => void }) {
  const t = useTranslations('SelfAssessment');
  const { watch } = useForm();
  const formData = watch();

  return (
    <div>
      <h2>{t('reviewYourAssessment')}</h2>
      {/* Display summary of form data */}
      <Button onClick={onSubmit}>{t('submitAssessment')}</Button>
    </div>
  );
}