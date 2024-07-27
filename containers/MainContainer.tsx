// This container integrates the components and handles data fetching and state management.

import React from 'react';
import { OrganizationProfile, CreateOrganization, UserButton } from '@clerk/nextjs';
import { Sidebar, SearchIcon } from 'lucide-react';
import { Button } from 'react-day-picker';
import ClientList from '../components/navigation/ClientListComponent';
import Header from '../components/navigation/HeaderComponent';
import InvoicesTable from '../components/navigation/InvoiceTableComponent';
import { Input } from '../components/ui/input';

const MainContainer: React.FC = () => {
  const clients = [
    { name: 'John Doe', email: 'johndoe@example.com', totalInvoices: 2500 },
    { name: 'Jane Doe', email: 'janedoe@example.com', totalInvoices: 1800 },
    { name: 'Bob Smith', email: 'bobsmith@example.com', totalInvoices: 3200 },
    { name: 'Sarah Johnson', email: 'sarahjohnson@example.com', totalInvoices: 1200 },
  ];

  const invoices = [
    { number: 'INV-001', client: 'John Doe', amount: 1500, status: 'Paid', dueDate: '2023-06-15' },
    // More invoice data here...
  ];

  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <Header />
      <main className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        <Sidebar />
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search" className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3" />
                </div>
              </form>
            </div>
            <UserButton afterSignOutUrl="/" />
          </header>
          <main className="flex-1 p-4 md:p-6">
            <div className="grid gap-8">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Clients</h1>
                  <Button>Add Client</Button>
                </div>
                <ClientList clients={clients} />
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Invoices</h1>
                  <Button>Create Invoice</Button>
                </div>
                <InvoicesTable invoices={invoices} />
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
};

export default MainContainer;
