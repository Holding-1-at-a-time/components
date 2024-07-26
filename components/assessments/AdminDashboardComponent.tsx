/* eslint-disable react/jsx-no-comment-textnodes */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BellIcon, BriefcaseIcon, CalendarIcon, CoinsIcon, FilePenIcon, HomeIcon, InfoIcon, MountainIcon, ReceiptIcon, SearchIcon, SettingsIcon, TrashIcon, UsersIcon } from "@/public/Icons";
import { WebcamIcon } from "lucide-react";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between animated-3d">
        <Link href="#" className="flex items-center gap-2 font-semibold text-lg" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span>Acme Business Solutions</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>John Doe</DropdownMenuLabel>
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
          <div className="flex h-full max-h-screen flex-col gap-2 parallax">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
                <MountainIcon className="h-6 w-6" />
                <span>Acme Business Solutions</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <BellIcon className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary pulse" prefetch={false}>
                  <HomeIcon className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary slide-in" prefetch={false}>
                  <BriefcaseIcon className="h-4 w-4" />
                  Clients
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">12</Badge>
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary zoom-in" prefetch={false}>
                  <ReceiptIcon className="h-4 w-4" />
                  Invoices
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary rotate-in" prefetch={false}>
                  <CalendarIcon className="h-4 w-4" />
                  Scheduling
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                  <WebcamIcon className="h-4 w-4" />
                  Chat
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                  <CoinsIcon className="h-4 w-4" />
                  Payments
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                  <UsersIcon className="h-4 w-4" />
                  Team
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                  <InfoIcon className="h-4 w-4" />
                  Analytics
                </Link>
                <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
            <Link href="#" className="lg:hidden" prefetch={false}>
              <MountainIcon className="h-6 w-6" />
              <span className="sr-only">Home</span>
            </Link>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search" className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3" />
                </div>
              </form>
            </div>
            // eslint-disable-next-line react/jsx-no-comment-textnodes
            <DropdownMenu>
              // eslint-disable-next-line react/jsx-no-comment-textnodes
              <DropdownMenuTrigger asChild>
                // eslint-disable-next-line react/jsx-no-comment-textnodes
                <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/placeholder.svg" width="32" height="32" className="rounded-full" alt="Avatar" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <div className="grid gap-8">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Clients</h1>
                  <Button>Add Client</Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <Card className="animated-3d">
                    <CardContent className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="border w-10 h-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-muted-foreground">johndoe@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Total Invoices: $2,500</p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <FilePenIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="animated-3d">
                    <CardContent className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="border w-10 h-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Jane Doe</p>
                          <p className="text-sm text-muted-foreground">janedoe@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Total Invoices: $1,800</p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <FilePenIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="animated-3d">
                    <CardContent className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="border w-10 h-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Bob Smith</p>
                          <p className="text-sm text-muted-foreground">bobsmith@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Total Invoices: $3,200</p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <FilePenIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="animated-3d">
                    <CardContent className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="border w-10 h-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Sarah Johnson</p>
                          <p className="text-sm text-muted-foreground">sarahjohnson@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Total Invoices: $1,200</p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <FilePenIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                    <TableRow className="animated-3d">
                      <TableCell>INV-001</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>$1,500</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Paid</Badge>
                      </TableCell>
                      <TableCell>2023-06-15</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <FilePenIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}
