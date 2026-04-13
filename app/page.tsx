'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Dashboard } from '@/components/dashboard'
import { CreateInvoice } from '@/components/create-invoice'

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue'

export interface Invoice {
  id: string
  client: string
  amount: number
  issueDate: string
  dueDate: string
  status: InvoiceStatus
}

const initialInvoices: Invoice[] = [
  { id: 'INV-001', client: 'Acme Corp', amount: 4500.0, issueDate: 'Mar 1', dueDate: 'Mar 31', status: 'Paid' },
  { id: 'INV-002', client: 'Globex Inc', amount: 2800.0, issueDate: 'Mar 5', dueDate: 'Apr 4', status: 'Paid' },
  { id: 'INV-003', client: 'Initech LLC', amount: 1200.0, issueDate: 'Mar 10', dueDate: 'Apr 9', status: 'Overdue' },
  { id: 'INV-004', client: 'Umbrella Co', amount: 3750.0, issueDate: 'Mar 15', dueDate: 'Apr 14', status: 'Sent' },
  { id: 'INV-005', client: 'Stark Industries', amount: 6200.0, issueDate: 'Mar 20', dueDate: 'Apr 19', status: 'Sent' },
  { id: 'INV-006', client: 'Wayne Enterprises', amount: 947.0, issueDate: 'Mar 22', dueDate: 'Apr 21', status: 'Draft' },
  { id: 'INV-007', client: 'Oscorp Labs', amount: 2100.0, issueDate: 'Mar 25', dueDate: 'Apr 24', status: 'Draft' },
  { id: 'INV-008', client: 'Pied Piper', amount: 1580.0, issueDate: 'Mar 28', dueDate: 'Apr 27', status: 'Sent' },
  { id: 'INV-009', client: 'Hooli Inc', amount: 4200.0, issueDate: 'Apr 1', dueDate: 'May 1', status: 'Sent' },
  { id: 'INV-010', client: 'Vandelay Ind', amount: 890.0, issueDate: 'Apr 3', dueDate: 'May 3', status: 'Draft' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'clients'>('dashboard')
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)

  const handleInvoiceSent = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev])
    setActiveTab('dashboard')
  }

  const handleCreateNew = () => {
    setActiveTab('create')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard invoices={invoices} onCreateNew={handleCreateNew} />
        )}
        {activeTab === 'create' && (
          <CreateInvoice 
            invoiceNumber={`INV-${String(invoices.length + 1).padStart(3, '0')}`}
            onInvoiceSent={handleInvoiceSent}
          />
        )}
        {activeTab === 'clients' && (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-muted-foreground">Clients management coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}
