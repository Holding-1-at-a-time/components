import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser, useOrganization } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/SpinnerComponent';
import { VehicleForm } from '@/components/VehicleFormComponent';
import { AppointmentForm } from '@/components/AppointmentForm';

export default function VehicleAppointmentManagement() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isSchedulingAppointment, setIsSchedulingAppointment] = useState(false);

  const vehicles = useQuery(api.vehicles.list, 
    organization?.id ? { organizationId: organization.id, search: searchTerm } : 'skip'
  );
  const appointments = useQuery(api.appointments.listByDate, 
    organization?.id ? { organizationId: organization.id, date: format(selectedDate, 'yyyy-MM-dd') } : 'skip'
  );

  const createVehicle = useMutation(api.vehicles.create);
  const createAppointment = useMutation(api.appointments.create);

  const handleAddVehicle = async (vehicleData: any) => {
    if (!organization) return;
    try {
      await createVehicle({ ...vehicleData, organizationId: organization.id });
      setIsAddingVehicle(false);
      toast({ title: "Vehicle added successfully" });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({ title: "Failed to add vehicle", variant: "destructive" });
    }
  };

  const handleScheduleAppointment = async (appointmentData: any) => {
    if (!organization || !selectedVehicle) return;
    try {
      await createAppointment({ 
        ...appointmentData, 
        organizationId: organization.id,
        vehicleId: selectedVehicle,
        date: format(selectedDate, 'yyyy-MM-dd')
      });
      setIsSchedulingAppointment(false);
      toast({ title: "Appointment scheduled successfully" });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({ title: "Failed to schedule appointment", variant: "destructive" });
    }
  };

  if (!organization) {
    return <div>Please select an organization to continue.</div>;
  }

  if (vehicles === undefined || appointments === undefined) {
    return <Spinner />;
  }

  const canAddVehicle = user?.publicMetadata.permissions?.includes('create:vehicle');
  const canScheduleAppointment = user?.publicMetadata.permissions?.includes('create:appointment');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicle and Appointment Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Input 
                placeholder="Search vehicles..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              {canAddVehicle && (
                <Button onClick={() => setIsAddingVehicle(true)}>Add Vehicle</Button>
              )}
            </div>
            <Table>
              {/* ... table content ... */}
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="mb-4"
            />
            <Table>
              {/* ... table content ... */}
            </Table>
            {canScheduleAppointment && selectedVehicle && (
              <Button 
                onClick={() => setIsSchedulingAppointment(true)}
                className="mt-4"
              >
                Schedule Appointment
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      {isAddingVehicle && (
        <VehicleForm onSubmit={handleAddVehicle} onCancel={() => setIsAddingVehicle(false)} />
      )}
      {isSchedulingAppointment && (
        <AppointmentForm 
          onSubmit={handleScheduleAppointment} 
          onCancel={() => setIsSchedulingAppointment(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}