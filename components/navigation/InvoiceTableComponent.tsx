// This component handles the table of invoices.

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { FilePenIcon } from '../Icons';
import { Button } from '../ui/button';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  number: string;
  client: string;
  amount: number;
  status: string;
  dueDate: string;
}

interface InvoicesTableProps {
  invoices: Invoice[];
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices }) => {
  return (
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
        {invoices.map((invoice, index) => (
          <TableRow key={index} className="animated-3d">
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
  );
};

export default InvoicesTable;
