export type AssessmentStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';

export interface Assessment {
  _id: string;
  organizationId: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    condition: string;
  };
  status: AssessmentStatus;
  createdAt: number;
  // Add other fields as necessary
}