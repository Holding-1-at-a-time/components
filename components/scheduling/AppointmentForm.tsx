import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hook/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Id } from "./_generated/dataModel";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const appointmentSchema = z.object({
  service: z.string().min(1, "Service is required"),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: SubmitHandler<AppointmentFormData>;
  onCancel: () => void;
  selectedDate: Date;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit, onCancel, selectedDate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Schedule Appointment</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" value={format(selectedDate, 'yyyy-MM-dd')} disabled />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" {...register('time')} />
            {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
          </div>
          <div>
            <Label htmlFor="service">Service</Label>
            <Select id="service" {...register('service')}>
              <option value="">Select a service</option>
              <option value="basic-wash">Basic Wash</option>
              <option value="full-detail">Full Detail</option>
              <option value="paint-correction">Paint Correction</option>
            </Select>
            {errors.service && <p className="text-red-500 text-sm">{errors.service.message}</p>}
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register('notes')} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Schedule</Button>
        </CardFooter>
      </form>
    </Card>
  );
};