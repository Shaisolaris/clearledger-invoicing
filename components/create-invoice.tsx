'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { X, Plus, Check, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InvoicePreview } from '@/components/invoice-preview'
import type { Invoice } from '@/app/page'

interface CreateInvoiceProps {
  invoiceNumber: string
  onInvoiceSent: (invoice: Invoice) => void
}

interface LineItem {
  id: string
  description: string
  quantity: string
  rate: string
}

const clients = [
  { id: 'acme', name: 'Acme Corp' },
  { id: 'globex', name: 'Globex Inc' },
  { id: 'initech', name: 'Initech LLC' },
  { id: 'umbrella', name: 'Umbrella Co' },
]

const initialLineItems: LineItem[] = [
  { id: '1', description: 'Website Redesign — Landing page and about section', quantity: '1', rate: '3500.00' },
  { id: '2', description: 'API Integration — Payment gateway setup', quantity: '8', rate: '150.00' },
  { id: '3', description: 'Monthly Hosting — Cloud infrastructure', quantity: '1', rate: '250.00' },
]

export function CreateInvoice({ invoiceNumber, onInvoiceSent }: CreateInvoiceProps) {
  const [client, setClient] = useState('')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [paymentTerms, setPaymentTerms] = useState('net30')
  const [lineItems, setLineItems] = useState<LineItem[]>(initialLineItems)
  const [notes, setNotes] = useState('Payment is due within 30 days. Thank you for your business.')
  const [taxRate] = useState(10)
  const [discount] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const calculateSubtotal = useCallback(() => {
    return lineItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0
      const rate = parseFloat(item.rate) || 0
      return sum + qty * rate
    }, 0)
  }, [lineItems])

  const subtotal = calculateSubtotal()
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax - discount

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: '', quantity: '1', rate: '0.00' },
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const handleSend = async () => {
    if (!client) {
      toast.error('Please select a client')
      return
    }

    setIsSending(true)
    
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSending(false)
    setIsSent(true)
    
    toast.success('Invoice sent successfully!')
    
    setTimeout(() => {
      const selectedClient = clients.find((c) => c.id === client)
      onInvoiceSent({
        id: invoiceNumber,
        client: selectedClient?.name || 'Unknown Client',
        amount: total,
        issueDate: new Date(issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dueDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: 'Sent',
      })
    }, 1000)
  }

  const selectedClientName = clients.find((c) => c.id === client)?.name || ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        {/* From & To Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-card rounded-xl border p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              From
            </p>
            <div className="space-y-1">
              <p className="font-semibold">ClearLedger Inc</p>
              <p className="text-sm text-muted-foreground">123 Business Ave, Suite 400</p>
              <p className="text-sm text-muted-foreground">New York, NY 10001</p>
              <p className="text-sm text-muted-foreground">billing@solaristek.com</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Bill To
            </p>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
                <SelectItem value="new">+ Add New Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-card rounded-xl border p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5">
            Invoice Details
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-number" className="text-xs text-muted-foreground">Invoice Number</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                readOnly
                className="bg-secondary h-11 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-date" className="text-xs text-muted-foreground">Issue Date</Label>
              <Input
                id="issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date" className="text-xs text-muted-foreground">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-terms" className="text-xs text-muted-foreground">Payment Terms</Label>
              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                <SelectTrigger id="payment-terms" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net15">Net 15</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-card rounded-xl border p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5">
            Line Items
          </p>
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_80px_100px_100px_40px] gap-3 text-xs font-medium text-muted-foreground uppercase pb-2 border-b">
              <span>Description</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Amount</span>
              <span></span>
            </div>

            {/* Items */}
            {lineItems.map((item, index) => {
              const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_80px_100px_100px_40px] gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="h-11"
                  />
                  <Input
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                    className="text-center h-11"
                  />
                  <Input
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', e.target.value)}
                    className="text-right h-11"
                  />
                  <div className="flex items-center justify-end h-11 px-3 bg-secondary rounded-lg text-sm font-semibold tabular-nums">
                    ${amount.toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}

            {/* Add Line Item Button */}
            <Button
              variant="outline"
              className="w-full border-dashed mt-3 h-11"
              onClick={addLineItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Line Item
            </Button>
          </div>

          {/* Totals */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                  <span className="font-medium tabular-nums">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-success tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card rounded-xl border p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Notes
          </p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            className="resize-none min-h-[100px]"
            rows={3}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={isSending || isSent}
          size="lg"
          className="w-full h-12 text-base font-semibold transition-all duration-300"
        >
          {isSent ? (
            <span className="flex items-center gap-2 animate-in zoom-in duration-300">
              <Check className="w-5 h-5" />
              Invoice Sent
            </span>
          ) : isSending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Send Invoice
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <InvoicePreview
          invoiceNumber={invoiceNumber}
          clientName={selectedClientName}
          issueDate={issueDate}
          dueDate={dueDate}
          lineItems={lineItems}
          subtotal={subtotal}
          tax={tax}
          taxRate={taxRate}
          discount={discount}
          total={total}
          notes={notes}
        />
      </div>
    </div>
  )
}
