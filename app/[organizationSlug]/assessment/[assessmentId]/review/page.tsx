"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/SpinnerComponent";
import { AIEstimation } from '@/components/AI/AIEstimation';
import { VehicleDetails } from '@/components/VehicleDetails';
import { ServiceSummary } from '@/components/ServiceSummary';
import { CustomizationSummary } from '@/components/CustomizationSummary';
import { FileGallery } from '@/components/FileGallery';
import { Button } from '@/components/ui/button';

export default function AssessmentReviewPage() {
  const params = useParams();
  const { organization } = useOrganization();
  const assessmentId = params.assessmentId as string;
  const assessment = useQuery(api.assessments.getAssessment, organization?.id ? { organizationId: organization.id, assessmentId } : 'skip' );

  if (!assessment) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Assessment Review</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleDetails vehicleDetails={assessment.vehicleDetails} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceSummary services={assessment.selectedServices} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customizations</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomizationSummary customizations={assessment.customizations} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileGallery images={assessment.images} videos={assessment.videos} />
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <AIEstimation
            vehicleDetails={assessment.vehicleDetails}
            selectedServices={assessment.selectedServices}
            customizations={assessment.customizations}
            uploadedFiles={[...assessment.images, ...assessment.videos]}
          />
        </div>
      </div>
      <div className="mt-8">
        <p className="text-sm text-gray-600">
          Please acknowledge that this is a non-binding estimate. The final price may vary based on additional factors.
        </p>
        <Button className="mt-4">Acknowledge</Button>
      </div>
    </div>
  );
}