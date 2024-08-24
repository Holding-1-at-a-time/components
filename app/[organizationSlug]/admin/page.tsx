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

interface Client {
  _id: string;
  name: string;
  email: string;
  totalInvoices: number;
}

export default function AdminDashboard() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const clients = useQuery(api.client.list, organization?.id ? { orgId: organization.id } : 'skip');
  const invoices = useQuery(api.invoices.list, organization?.id ? { orgId: organization.id } : 'skip');

  if (!organization || !user) {
    return <div>Loading...</div>;
  }

  const handleDeleteClient = useMutation(api.client.deleteClient);

  const deleteClientById = async (clientId: string) => {
    try {
      await handleDeleteClient({ clientId });
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete the client: ${error.message}`,
        variant: "destructive",
      });
      console.error(`error: ${error.message}`, error);
    }
  };


  async function handleDeleteClient(clientId: string) {
    try {
      await deleteClientMutation({ clientId });
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete the client: ${error.message}`,
        variant: "destructive",
      });
      console.error(`Error deleting client: ${error.message}`, error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header organization={organization} />
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <NavItem href="#" label="Dashboard" icon={<HomeIcon className="h-4 w-4" />} />
          <NavItem href="#" label="Clients" icon={<BriefcaseIcon className="h-4 w-4" />} count={clientsQuery?.length || 0} />
          {/* Add more navigation items here */}
        </nav>
      </div>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-8">
          <ClientList clients={clientsQuery} onDeleteClient={handleDeleteClient} />
          <InvoiceList invoices={invoicesQuery} />
        </div>
      </main>
    </div>
  );
}

function Header({ organization }: { organization: Organization }) {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <Link href="#" className="flex items-center gap-2 font-semibold text-lg">
        <MountainIcon className="h-6 w-6" />
        <span>{organization.name}</span>
      </Link>
      <nav className="flex items-center gap-4">
        <NavItem href="#" label="Features" />
        <NavItem href="#" label="Pricing" />
        <NavItem href="#" label="About" />
        <NavItem href="#" label="Contact" />
        <UserDropdown user={user} />
      </nav>
    </header>
  );
}

function NavItem({ href, label, icon, count }: { href: string, label: string, icon?: React.ReactNode, count?: number }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
      {icon}
      <span>{label}</span>
      {count && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{count}</Badge>}
    </Link>
  );
}

function UserDropdown({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2 font-semibold text-lg">
          <MountainIcon className="h-6 w-6" />
          <span>{organization.name}</span>
        </Link>
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
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <MountainIcon className="h-6 w-6" />
            <span className
              className="">{organization.name}</span>
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
                {clients?.map((client) => (
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
                          <Button variant="outline" size="icon" onClick={() => deleteClientById(client._id)}>
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
                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'}className="">{organization.name}</span>
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
                          {clients?.map((client) => (
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
                                    <Button variant="outline" size="icon" onClick={() => deleteClientById(client._id)}>
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
                                  <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'}
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
            </div>
            );

            function logerrors(arg0: string, error: unknown) {
              console.error(arg0, error)}

            async function deleteClientById(clientId: string) {
              try {
                await handleDeleteClient({ clientId });
                toast({
                  title: "Client deleted",
                  description: "The client has been successfully deleted.",
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: `Failed to delete the client: ${error.message}`,
                  variant: "destructive",
                });
                console.error(`error: ${error.message}`, error);
              }
            }
          }
          
