import { useOrganization, UserButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { SearchIcon, Sidebar } from 'lucide-react';
import React from 'react';
import { Button } from 'react-day-picker';
import ClientList from '../components/navigation/ClientListComponent';
import Header from '../components/navigation/HeaderComponent';
import InvoicesTable from '../components/navigation/InvoiceTableComponent';
import { Input } from '../components/ui/input';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

const MainContainer: React.FC = () => {
  // Get the currently selected organization
  const { organization } = useOrganization();
  const orgId = organization?.id as Id<'organization'>;

  // Fetch the list of clients and invoices for the selected organization
  const clients = useQuery(api.client.list, orgId ? { search: '', organizationId: orgId } : 'skip');
  const invoices = useQuery(api.invoices.list, orgId ? { orgId, search: '' } : 'skip'); // Adjusted to match the expected type

  // If no organization is selected, display a message
  if (!orgId) {
    return <div>Please select an organization to continue.</div>;
  }

  // If the data is still loading, display a loading message
  if (clients === undefined || invoices === undefined) {
    return <div>Loading...</div>;
  }

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