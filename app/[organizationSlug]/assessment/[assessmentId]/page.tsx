"use client";

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function AssessmentDetailsPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;

  const assessment = useQuery(api.assessments.getAssessment, { id: assessmentId });

  if (assessment === undefined) {
    return <AssessmentDetailsSkeleton />;
  }

  if (assessment === null) {
    return <div>Assessment not found.</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Assessment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold">Vehicle Details</h3>
            <p>Make: {assessment.vehicleDetails.make}</p>
            <p>Model: {assessment.vehicleDetails.model}</p>
            <p>Year: {assessment.vehicleDetails.year}</p>
            <p>VIN: {assessment.vehicleDetails.vin}</p>
            <p>Color: {assessment.vehicleDetails.color}</p>
            <p>Body Type: {assessment.vehicleDetails.bodyType}</p>
            <p>Condition: {assessment.vehicleDetails.condition}</p>
          </div>
          <div>
            <h3 className="font-semibold">Selected Services</h3>
            <ul>
              {assessment.selectedServices.map((serviceId) => (
                <li key={serviceId}>{serviceId}</li> // You might want to fetch service details here
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Customizations</h3>
            <ul>
              {assessment.customizations.map((customization, index) => (
                <li key={index}>{customization.name}: ${customization.price}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Total Price</h3>
            <p>${assessment.totalPrice.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Uploaded Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {assessment.imageUrls.map((url, index) => (
                <Image key={index} src={url} alt={`Vehicle image ${index + 1}`} width={200} height={200} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Uploaded Videos</h3>
            <ul>
              {assessment.videoUrls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">Video {index + 1}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentDetailsSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}