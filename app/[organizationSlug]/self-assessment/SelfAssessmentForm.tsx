import { VINScanner } from '@/components/VINScanner';
import ServiceSelection from '@/components/assessments/ServiceSelectionComponent';
import VehicleHotspotAssessment from '@/components/assessments/VehicleHotspotAssessmentCompoenent';
import ReviewStep from '@/components/assessments/ReviewStep';
import { api } from '@/convex/_generated/api';
import { useAction } from 'convex/react';
import { useState } from 'react';

export default function SelfAssessmentForm({ services, organizationSlug }: { services: {}[], organizationSlug: string }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        vehicleInfo: {},
        condition: [],
        selectedServices: [],
        customizations: [],
        images: [],
        videos: [],
    });

    const createSelfAssessment = useAction(api.selfAssessment.createSelfAssessment);

    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const aiEstimationResult = await aiEstimation({
      vehicleDetails: formData.vehicleInfo,
      selectedServices: formData.selectedServices,
      customizations: formData.customizations,
      uploadedFiles: [...formData.images, ...formData.videos],
    });

    setFormData(prev => ({ ...prev, estimatedTotal: aiEstimationResult }));

    const result = await createSelfAssessment({
      organizationId: organizationSlug,
      ...formData,
    });
    // Handle successful submission (e.g., show success message, redirect)
  } catch (error) {
    // Handle error (e.g., show error message)
  }
};;

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const [formData, setFormData] = useState({
        vehicleInfo: {},
        condition: [],
        selectedServices: [],
        customizations: [],
        images: [],
        videos: [],
        estimatedTotal: null,
    });

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <VINScanner onVINDecoded={(info) => updateFormData('vehicleInfo', info)} />;
            case 1:
                return <VehicleHotspotAssessment onAssessment={(assessment) => updateFormData('condition', assessment)} />;
            case 2:
                return <ServiceSelection services={services} onSelect={(selected) => updateFormData('selectedServices', selected)} />;
            case 3:
                return <FileUpload onUpload={(files) => updateFormData('images', files)} />;
            case 4:
                return <ReviewStep
                    vehicleDetails={formData.vehicleInfo}
                    selectedServices={formData.selectedServices}
                    customizations={formData.customizations}
                    hotspots={formData.condition}
                    images={formData.images}
                    videos={formData.videos}
                    estimatedTotal={formData.estimatedTotal}
                />;
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {renderStep()}
            <div>
                {step > 0 && <button onClick={prevStep}>Previous</button>}
                {step < 4 ? <button onClick={nextStep}>Next</button> : <button type="submit">Submit</button>}
            </div>
        </form>
    );
}