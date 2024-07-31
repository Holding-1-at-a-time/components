"use client";

import React, { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import VehicleForm from '@/components/assessments/VehicleAssessmentForm';
import Spinner from '@/components/SpinnerComponent';
import { usePermissions } from '@/hooks/usePermissions';
import { FilePenIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';
import { VehicleInformationForm } from '@/components/forms/VehicleInformationForm';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const VehiclePage: React.FC = () => {
  const { organization } = useOrganization();
  const { hasPermission } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const vehicles = useQuery(api.vehicles.listByOrganization,
    organization?.id ? { organizationId: organization.id, search: searchTerm } : 'skip'
  );

  const deleteVehicle = useMutation(api.vehicles.remove);

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!hasPermission('delete_vehicles')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete vehicles.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteVehicle({ id: vehicleId });
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been successfully removed from the system.",
      });
    } catch (error) {
      Console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to delete the vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!organization) {
    return <div>Loading organization...</div>;
  }

  if (vehicles === undefined) {
    return <Spinner />;
  }

  if (vehicles === null) {
    return <div>Error loading vehicles. Please try again.</div>;
  }

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
      <VehicleInformationForm />
        <div className={`container mx-auto p-6 ${theme === 'dark' ? 'bg-backgroundone-dark' : 'bg-backgroundone-light'}`}>
          <h1 className="text-3xl font-bold mb-6 text-primary-foreground">Vehicle Management</h1>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {hasPermission('add_vehicles') && (
              <Button onClick={() => setIsAddingVehicle(true)} className="animated-3d">Add Vehicle</Button>
            )}
          </div>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-primary-dark">
                <TableHead className="text-white">Make</TableHead>
                <TableHead className="text-white">Model</TableHead>
                <TableHead className="text-white">Year</TableHead>
                <TableHead className="text-white">VIN</TableHead>
                <TableHead className="text-white">License Plate</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle._id} className="hover:shadow-3d transition-all duration-300">
                  <TableCell className="animated-3d">{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {hasPermission('edit_vehicles') && (
                        <Button variant="outline" size="icon" className="animated-3d">
                          <FilePenIcon className="h-4 w-4 text-primary-foreground" />
                        </Button>
                      )}
                      {hasPermission('delete_vehicles') && (
                        <Button variant="destructive" onClick={() => handleDeleteVehicle(vehicle._id)}>Delete</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              <VehicleForm onClose={() => setIsAddingVehicle(false)} />
            </DialogContent>
          </Dialog>
          <Dialog open={!!editingVehicleId} onOpenChange={() => setEditingVehicleId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Vehicle</DialogTitle>
              </DialogHeader>
              <VehicleForm onClose={() => setEditingVehicleId(null)} vehicleId={editingVehicleId!} />
            </DialogContent>
          </Dialog>
        </div>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default VehiclePage;
