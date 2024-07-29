import React, { useState, useMemo, useCallback } from "react";
import { useOrganization } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { format, parseISO, isValid, startOfDay, endOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/AppointmentForm";
import { useAppSettings } from "@/hooks/useAppSettings";
import { usePermissions } from "@/hooks/usePermissions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Appointment } from "@/types/appointment";

export function AppointmentScheduler() {
  const { organization } = useOrganization();
  const { timeZone, dateFormat, timeFormat } = useAppSettings();
  const { hasPermission } = usePermissions();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const appointments = useQuery(api.appointments.listByOrganization, 
    organization?.id ? { organizationId: organization.id } : 'skip'
  );

  const createAppointment = useMutation(api.appointments.create);
  const updateAppointment = useMutation(api.appointments.update);
  const cancelAppointment = useMutation(api.appointments.cancel);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    const startOfDayUTC = zonedTimeToUtc(startOfDay(selectedDate), timeZone);
    const endOfDayUTC = zonedTimeToUtc(endOfDay(selectedDate), timeZone);
    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      const isOnSelectedDate = isValid(appointmentDate) && 
        appointmentDate >= startOfDayUTC && 
        appointmentDate < endOfDayUTC;
      const matchesSearch = searchTerm === "" || 
        appointment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
      return isOnSelectedDate && matchesSearch && matchesStatus;
    });
  }, [appointments, selectedDate, timeZone, searchTerm, statusFilter]);

  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredAppointments, sortBy, sortDirection]);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleSort = useCallback((field: string) => {
    setSortBy(field);
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  }, []);

  const handleAppointmentCreate = useCallback(async (appointmentData: Partial<Appointment>) => {
    if (!organization) {
      toast({ title: "Error", description: "No organization selected", variant: "destructive" });
      return;
    }
    try {
      await createAppointment({
        ...appointmentData,
        organizationId: organization.id,
        date: zonedTimeToUtc(new Date(appointmentData.date!), timeZone).toISOString(),
      });
      toast({ title: "Success", description: "Appointment created successfully" });
      setIsCreatingAppointment(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({ title: "Error", description: "Failed to create appointment", variant: "destructive" });
    }
  }, [organization, createAppointment, timeZone]);

  const handleAppointmentUpdate = useCallback(async (appointmentId: string, appointmentData: Partial<Appointment>) => {
    try {
      await updateAppointment({
        id: appointmentId,
        ...appointmentData,
        date: zonedTimeToUtc(new Date(appointmentData.date!), timeZone).toISOString(),
      });
      toast({ title: "Success", description: "Appointment updated successfully" });
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({ title: "Error", description: "Failed to update appointment", variant: "destructive" });
    }
  }, [updateAppointment, timeZone]);

  const handleAppointmentCancel = useCallback(async (appointmentId: string) => {
    try {
      await cancelAppointment({ id: appointmentId });
      toast({ title: "Success", description: "Appointment cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({ title: "Error", description: "Failed to cancel appointment", variant: "destructive" });
    }
  }, [cancelAppointment]);

  if (!organization) {
    return <div>Loading organization...</div>;
  }

  if (appointments === undefined) {
    return <Spinner />;
  }

  if (appointments === null) {
    return <div>Error loading appointments. Please try again.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        {hasPermission('create_appointment') && (
          <Button variant="secondary" onClick={() => setIsCreatingAppointment(true)}>
            Create Appointment
          </Button>
        )}
      </header>
      <div className="flex-1 grid grid-cols-[300px_1fr] gap-4 p-4">
        <div className="bg-background rounded-lg shadow-md p-4">
          <Calendar 
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && handleDateChange(date)} 
            className="w-full"
          />
          <div className="mt-4">
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>
        <div className="bg-background rounded-lg shadow-md p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-bold">Appointments for </span>
              {format(selectedDate, dateFormat, { timeZone })}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort by: {sortBy} {sortDirection === "asc" ? "↑" : "↓"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["date", "customer", "service", "status"].map((field) => (
                  <DropdownMenuCheckboxItem
                    key={field}
                    checked={sortBy === field}
                    onCheckedChange={() => handleSort(field)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{format(utcToZonedTime(parseISO(appointment.date), timeZone), timeFormat)}</TableCell>
                  <TableCell>{appointment.customer}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "Scheduled"
                          ? "secondary"
                          : appointment.status === "Completed"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {hasPermission('edit_appointment') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingAppointment(appointment)}
                        >
                          Edit
                        </Button>
                      )}
                      {hasPermission('cancel_appointment') && appointment.status === "Scheduled" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleAppointmentCancel(appointment._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isCreatingAppointment} onOpenChange={setIsCreatingAppointment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm onSubmit={handleAppointmentCreate} onCancel={() => setIsCreatingAppointment(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {editingAppointment && (
            <AppointmentForm
              onSubmit={(data) => handleAppointmentUpdate(editingAppointment._id, data)}
              onCancel={() => setEditingAppointment(null)}
              initialData={editingAppointment}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}