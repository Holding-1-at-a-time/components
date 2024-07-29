import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface ClientFormProps {
  onClose: () => void;
  organizationId: string;
  clientData?: any;  // For editing existing client
}

export default function ClientForm({ onClose, organizationId, clientData }: ClientFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: clientData || {},
  });

  const createClient = useMutation(api.clients.create);
  const updateClient = useMutation(api.clients.update);

  const onSubmit = async (data: any) => {
    try {
      if (clientData) {
        await updateClient({ id: clientData._id, ...data });
        toast({ title: "Client updated successfully" });
      } else {
        await createClient({ ...data, organizationId });
        toast({ title: "Client created successfully" });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save client. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name", { required: "Name is required" })} placeholder="Name" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <Input {...register("email", { required: "Email is required" })} placeholder="Email" type="email" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <Input {...register("phone")} placeholder="Phone" />

      <Input {...register("address")} placeholder="Address" />

      <Textarea {...register("notes")} placeholder="Notes" />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}