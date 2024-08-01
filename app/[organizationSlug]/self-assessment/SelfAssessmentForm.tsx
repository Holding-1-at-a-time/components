import { VINScanner } from '@/components/VINScanner';
import ServiceSelection from '@/components/assessments/ServiceSelectionComponent';
import VehicleHotspotAssessment from '@/components/assessments/VehicleHotspotAssessmentCompoenent';
import ReviewStep from '@/components/assessments/ReviewStep';
import { api } from '@/convex/_generated/api';
import { useAction } from 'convex/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';


export default function SelfAssessmentForm({ services, organizationSlug }: { services: {}[], organizationSlug: string }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        vehicleInfo: {},
        condition: [],
        selectedServices: [],
        customizations: [],
        images: [],
        videos: [],
        estimatedTotal: null,
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
            await createSelfAssessment({
                organizationId: organizationSlug,
                ...formData,
            });
            // Handle successful submission (e.g., show success message, redirect)
            toast({ title: 'Success', description: 'Self-assessment submitted successfully' });
        } catch (error) {
            // Handle error (e.g., show error message)
            toast({ title: 'Error', description: error.message });
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    const updateFormData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
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
            <div className="flex justify-between">
                {step > 0 && <Button onClick={prevStep}>Previous</Button>}
                {step < 4 && <Button onClick={nextStep}>Next</Button>}
                {step === 4 && <Button type="submit">Submit</Button>}
            </div>
        </form>
    </div>
)
};
export default SelfAssessmentForm;