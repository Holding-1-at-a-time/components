export type AssessmentStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';

export interface Assessment {
    _id: string;
    organizationId: string;
    vehicleDetails: {
        make: string;
        model: string;
        year: string;
        color: string;
        VIN: string;
        licensePlate: string;
        licenseState: string;
        vehicleTypeId: string;
        odometer: string;
        vehicleType: string;
        fuelType: string;
        transmission: string;
        bodyType: string;
        numberDoors: number;
        numberSeats: number;
        numberCylinders: number;
        notes: string;
        condition: string;
    };
    status: AssessmentStatus;
    createdAt: number;
}

export interface Assessment {
    _id: string;
    organizationId: string;
    vehicleDetails: {
        make: string;
        model: string;
        year: string;
        color: string;
        VIN: string;
        licensePlate: string;
        licenseState: string;
        vehicleTypeId: string;
        odometer: string;
        vehicleType: string;
        fuelType: string;
        transmission: string;
        bodyType: string;
        numberDoors: number;
        numberSeats: number;
        numberCylinders: number;
        notes: string;
        condition: string;
    };
    status: AssessmentStatus;
    createdAt: number
}