"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function SchedulePage() {
  const params = useParams();
  const { organization } = useOrganization();
  const assessmentId = params.assessmentId as string;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scheduleAppointment = useMutation(api.appointments.schedule);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const deposit = calculateDeposit();
      await scheduleAppointment({ organizationId: organization.id, assessmentId, date, time, deposit });
      toast({ title: 'Appointment Scheduled', description: 'Your appointment has been successfully scheduled.' });
      // Redirect to confirmation page or show success message
    } catch (error) {
      Console.error('Error scheduling appointment:', error);
      toast({ title: 'Scheduling Error', description: 'There was an error scheduling your appointment. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDeposit = () => {
    // Calculate 20% non-refundable deposit
    const total = assessment.totalPrice;
    return total * 0.2;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Schedule Appointment</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Schedule Your Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}