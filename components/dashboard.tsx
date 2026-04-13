'use client'

import { useState } from 'react'
import { 
  ArrowUpRight, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Plus,
  Search,
  Eye,
  Pencil,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Invoice, InvoiceStatus } from '@/app/page'

interface DashboardProps {
  invoices: Invoice[]
  onCreateNew: () => void
}

const summaryCards = [
  {
    title: 'Total Revenue',
    value: '$47,215',
    change: '+12.5%',
    icon: ArrowUpRight,
    positive: true,
  },
  {
    title: 'Outstanding',
    value: '$8,432',
    subtitle: '4 invoices',
    icon: Clock,
  },
  {
    title: 'Overdue',
    value: '$2,147',
    subtitle: '2 invoices',
    icon: AlertCircle,
    warning: true,
  },
  {
    title: 'Paid This Month',
    value: '$12,840',
    change: '+8.2%',
    icon: CheckCircle,
    positive: true,
  },
]

const statusStyles: Record<InvoiceStatus, string> = {
  Draft: 'bg-secondary text-secondary-foreground',
  Sent: 'bg-secondary text-secondary-foreground',
  Paid: 'bg-success/10 text-success',
  Overdue: 'bg-destructive/10 text-destructive',
}

export function Dashboard({ invoices, onCreateNew }: DashboardProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(search.toLowerCase()) ||
      invoice.client.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-card rounded-xl border p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                <p className="text-3xl font-semibold tracking-tight">
                  {card.value}
                </p>
                {card.change && (
                  <p className={`text-sm font-medium ${card.positive ? 'text-success' : 'text-muted-foreground'}`}>
                    {card.change} from last month
                  </p>
                )}
                {card.subtitle && (
                  <p className={`text-sm ${card.warning ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-2.5 rounded-lg ${card.warning ? 'bg-destructive/10' : 'bg-secondary'}`}>
                <card.icon className={`w-5 h-5 ${card.warning ? 'text-destructive' : 'text-muted-foreground'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Invoices Section */}
      <div className="bg-card rounded-xl border">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Manage and track your invoices</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-[200px] h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onCreateNew} className="h-10">
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Invoice</TableHead>
                <TableHead className="font-medium">Client</TableHead>
                <TableHead className="font-medium text-right">Amount</TableHead>
                <TableHead className="font-medium hidden md:table-cell">Issued</TableHead>
                <TableHead className="font-medium hidden md:table-cell">Due</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="group">
                  <TableCell>
                    <button className="text-foreground hover:text-muted-foreground font-medium transition-colors">
                      {invoice.id}
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">{invoice.client}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {invoice.issueDate}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {invoice.dueDate}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusStyles[invoice.status]} font-medium`} variant="secondary">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
