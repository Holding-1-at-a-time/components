<<<<<<< HEAD
"use client";

import React from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MountainIcon, HomeIcon, BriefcaseIcon, ReceiptIcon, CalendarIcon, WebcamIcon, CoinsIcon, UsersIcon, InfoIcon, SettingsIcon, BellIcon, SearchIcon, FilePenIcon, TrashIcon } from '@/components/Icons';
=======
import { BellIcon, BriefcaseIcon, FilePenIcon, HomeIcon, MountainIcon, SearchIcon, TrashIcon } from '@/components/Icons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from '@/components/ui/use-toast';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import Link from "next/link";
import { stderr } from 'process';
import { loggers } from 'winston';

interface Client {
  _id: string;
  name: string;
  email: string;
  totalInvoices: number;
}
>>>>>>> c51587409a955418810f61cf695203e9470b93e5

export default function AdminDashboard() {
  const { organization } = useOrganization();
  const { user } = useUser();
<<<<<<< HEAD
  const clients = useQuery(api.clients.list, organization?.id ? { orgId: organization.id } : 'skip');
  const invoices = useQuery(api.invoices.list, organization?.id ? { orgId: organization.id } : 'skip');
  const deleteClient = useMutation(api.clients.deleteClient);
=======
  const clients = useQuery(api.client.list, organization?.id ? { orgId: organization.id } : 'skip');
  const invoices = useQuery(api.invoices.list, organization?.id ? { orgId: organization.id } : 'skip');
  const deleteClient = useMutation(api.client.deleteClient);
>>>>>>> c51587409a955418810f61cf695203e9470b93e5

  if (!organization || !user) {
    return <div>Loading...</div>;
  }
<<<<<<< HEAD

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient({ clientId });
      // Optionally, you can add a toast notification here
    } catch (error) {
      console.error('Error deleting client:', error);
      // Optionally, you can add an error toast notification here
    }
  };

=======
const useCustomMutation = () => {
  const handleDeleteClient = useMutation(api.client.deleteClient);

  const deleteClientById = async (clientId: Id<"clients">) => {
    try {
      await handleDeleteClient({ clientId });
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted.",
      });
      // Optionally, you can add a toast notification here
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete the client: ${error.message}`,
        variant: "destructive",
      });
      logerrors(`error: ${error.message}`, error);
      // Add toast notification for error handling
    }
  };

  return { deleteClientById };
};


const handleDeleteClient = useMutation(api.client.deleteClient);

>>>>>>> c51587409a955418810f61cf695203e9470b93e5
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2 font-semibold text-lg">
          <MountainIcon className="h-6 w-6" />
          <span>{organization.name}</span>
        </Link>
<<<<<<< HEAD
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Features</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Pricing</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">About</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <main className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        <div className="bg-muted/40 border-r">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link href="#" className="flex items-center gap-2 font-semibold">
                <MountainIcon className="h-6 w-6" />
                <span className="">{organization.name}</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <BellIcon className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <HomeIcon className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                  <BriefcaseIcon className="h-4 w-4" />
                  Clients
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{clients?.length || 0}</Badge>
                </Link>
                {/* Add more navigation items here */}
              </nav>
            </div>
=======
      </header>
      <main className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        <div className="bg-muted/40 border-r">
          <nav className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Features</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Pricing</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">About</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="#" className="flex items-center gap-2 font-semibold">
              <MountainIcon className="h-6 w-6" />
              <span className="">{organization.name}</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <HomeIcon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="#" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                <BriefcaseIcon className="h-4 w-4" />
                Clients
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{clients?.length || 0}</Badge>
              </Link>
              {/* Add more navigation items here */}
            </nav>
>>>>>>> c51587409a955418810f61cf695203e9470b93e5
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search"
                    className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <div className="grid gap-8">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Clients</h1>
                  <Button>Add Client</Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
<<<<<<< HEAD
                  {clients?.map((client) => (
=======
                  {clients?.map((client: Client) => (
>>>>>>> c51587409a955418810f61cf695203e9470b93e5
                    <Card key={client._id}>
                      <CardContent className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="border w-10 h-10">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>{client.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Total Invoices: ${client.totalInvoices}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
<<<<<<< HEAD
                            <Button variant="outline" size="icon" onClick={() => handleDeleteClient(client._id)}>
=======
                            <Button variant="outline" size="icon" onClick={() => handleDeleteClient(client)}>
>>>>>>> c51587409a955418810f61cf695203e9470b93e5
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Invoices</h1>
                  <Button>Create Invoice</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices?.map((invoice) => (
                      <TableRow key={invoice._id}>
                        <TableCell>{invoice.number}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>${invoice.amount}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                              <FilePenIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
<<<<<<< HEAD
  );
}
=======
  )
}

function logerrors(arg0: string, error: unknown) {
  throw new Error('Function not implemented.');
}
>>>>>>> c51587409a955418810f61cf695203e9470b93e5
