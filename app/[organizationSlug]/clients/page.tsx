"use client";

import React, { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ClientForm from '@/components/form/ClientForm';
import { Id } from '@/convex/_generated/dataModel';

export default function ClientManagement() {
  const { organization } = useOrganization();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const clients = useQuery(api.client.list, organization?.id ? { organizationId: organization.id as Id<"organization">, search: searchTerm } : 'skip');  );
  const deleteClient = useMutation(api.client.remove);

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient({ client: v.id('clients') });
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the client. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddingClient(true)}>Add Client</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Last Assessment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client._id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.lastAssessmentDate || 'N/A'}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mr-2">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Client</DialogTitle>
                    </DialogHeader>
                    <ClientForm
                      onClose={() => setEditingClient(null)}
                      organizationId={organization.id}
                      clientData={client}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => handleDeleteClient(client._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm
            onClose={() => setIsAddingClient(false)}
            organizationId={organization.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}