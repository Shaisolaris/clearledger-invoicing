'use client'

interface LineItem {
  id: string
  description: string
  quantity: string
  rate: string
}

interface InvoicePreviewProps {
  invoiceNumber: string
  clientName: string
  issueDate: string
  dueDate: string
  lineItems: LineItem[]
  subtotal: number
  tax: number
  taxRate: number
  discount: number
  total: number
  notes: string
}

export function InvoicePreview({
  invoiceNumber,
  clientName,
  issueDate,
  dueDate,
  lineItems,
  subtotal,
  tax,
  taxRate,
  discount,
  total,
  notes,
}: InvoicePreviewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Preview Header */}
      <div className="px-5 py-3 border-b bg-secondary/50">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Live Preview
        </p>
      </div>

      {/* Invoice Document */}
      <div className="p-6 bg-card min-h-[600px] relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg">ClearLedger</span>
            </div>
            <div className="space-y-0.5 text-sm text-muted-foreground">
              <p>123 Business Ave, Suite 400</p>
              <p>New York, NY 10001</p>
              <p>billing@solaristek.com</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold tracking-tight mb-3">INVOICE</h1>
            <div className="space-y-1 text-sm">
              <p className="font-mono font-medium">{invoiceNumber}</p>
              <p className="text-muted-foreground">{formatDate(issueDate)}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Bill To</p>
          {clientName ? (
            <div className="space-y-0.5">
              <p className="font-semibold">{clientName}</p>
              <p className="text-sm text-muted-foreground">Client Address Line 1</p>
              <p className="text-sm text-muted-foreground">City, State ZIP</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Select a client...</p>
          )}
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-secondary/50">
              <div className="grid grid-cols-[1fr_50px_70px_70px] gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Description</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Amount</span>
              </div>
            </div>
            <div className="divide-y">
              {lineItems.map((item) => {
                const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_50px_70px_70px] gap-2 px-4 py-3 text-sm transition-all duration-150"
                  >
                    <span className="truncate">{item.description || '—'}</span>
                    <span className="text-center text-muted-foreground">{item.quantity || '0'}</span>
                    <span className="text-right text-muted-foreground tabular-nums">
                      ${parseFloat(item.rate || '0').toFixed(2)}
                    </span>
                    <span className="text-right font-medium tabular-nums">${amount.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-56 space-y-2">
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
            <div className="flex justify-between pt-3 border-t mt-3">
              <span className="font-semibold">Total Due</span>
              <span className="text-xl font-bold tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-6 p-4 rounded-lg bg-secondary/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Payment Due</span>
            <span className="font-medium">{formatDate(dueDate)}</span>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="text-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
            <p className="text-muted-foreground">{notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
