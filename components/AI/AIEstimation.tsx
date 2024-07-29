import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/SpinnerComponent";
import { toast } from "@/components/ui/use-toast";
import { usePermissions } from '@/hooks/usePermissions';
import { VehicleDetails, Service, Customization, UploadedFile } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AIEstimationProps {
  selfAssessmentId: string;
}

export function AIEstimation({ selfAssessmentId }: AIEstimationProps) {
  const selfAssessment = useQuery(api.selfAssessments.getSelfAssessment, { id: selfAssessmentId });

  if (!selfAssessment) {
    return <Spinner />;
  }

  const { aiEstimation } = selfAssessment;

  if (!aiEstimation) {
    return <div>AI estimation not available yet.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Estimation</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-semibold">Estimated Total</h3>
          <p className="text-lg">${aiEstimation.estimatedTotal.toFixed(2)}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Detailed Analysis</h3>
          <p className="whitespace-pre-wrap">{aiEstimation.detailedAnalysis}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface AIEstimationProps {
  vehicleDetails: VehicleDetails;
  selectedServices: Service[];
  customizations: Customization[];
  uploadedFiles: UploadedFile[];
}

interface AIAnalysis {
  estimatedTotal: number;
  detailedAnalysis: {
    vehicleCondition: string;
    recommendedServices: string[];
    timeEstimate: string;
    potentialIssues: string[];
  };
}

export function AIEstimation({ vehicleDetails, selectedServices, customizations, uploadedFiles }: AIEstimationProps) {
  const { organization } = useOrganization();
  const { hasPermission } = usePermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const getAIAnalysis = useMutation(api.ai.getAnalysis);
  const cachedAnalysis = useQuery(
    api.ai.getCachedAnalysis,
    organization?.id ? {
      organizationId: organization.id,
      vehicleId: vehicleDetails.id,
    } : 'skip'
  );

  const generateAIAnalysis = useCallback(async () => {
    if (!organization || !hasPermission('use_ai_estimation')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to use AI estimation.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await getAIAnalysis({
        organizationId: organization.id,
        vehicleDetails,
        selectedServices: selectedServices.map(s => s.id),
        customizations: customizations.map(c => c.id),
        uploadedFileIds: uploadedFiles.map(f => f.id),
      });

      setAiAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "AI estimation has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to generate AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [organization, vehicleDetails, selectedServices, customizations, uploadedFiles, getAIAnalysis, hasPermission]);

  useEffect(() => {
    if (cachedAnalysis) {
      setAiAnalysis(cachedAnalysis);
    }
  }, [cachedAnalysis]);

  if (!hasPermission('use_ai_estimation')) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Estimation</CardTitle>
        <CardDescription>Our AI analyzes your vehicle's condition and selected services to provide a detailed estimate.</CardDescription>
      </CardHeader>
      <CardContent>
        {aiAnalysis ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Estimated Total</AccordionTrigger>
              <AccordionContent>
                <p className="text-lg font-bold">${aiAnalysis.estimatedTotal.toFixed(2)}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Vehicle Condition</AccordionTrigger>
              <AccordionContent>
                <p>{aiAnalysis.detailedAnalysis.vehicleCondition}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Recommended Services</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {aiAnalysis.detailedAnalysis.recommendedServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Estimated Time</AccordionTrigger>
              <AccordionContent>
                <p>{aiAnalysis.detailedAnalysis.timeEstimate}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Potential Issues</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {aiAnalysis.detailedAnalysis.potentialIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p>No AI analysis available. Click 'Generate AI Analysis' to get started.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={generateAIAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? <Spinner className="mr-2" /> : null}
          {isAnalyzing ? 'Analyzing...' : 'Generate AI Analysis'}
        </Button>
      </CardFooter>
    </Card>
  );
}