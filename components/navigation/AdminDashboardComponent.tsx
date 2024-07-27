/* eslint-disable react/jsx-no-comment-textnodes */
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { BellIcon, BriefcaseIcon, CalendarIcon, CoinsIcon, FilePenIcon, HomeIcon, InfoIcon, MountainIcon, ReceiptIcon, SearchIcon, SettingsIcon, TrashIcon, UsersIcon } from "../Icons";
import { Badge, WebcamIcon } from "lucide-react";
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
