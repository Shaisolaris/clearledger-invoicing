'use client'

import { Receipt, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  activeTab: 'dashboard' | 'create' | 'clients'
  onTabChange: (tab: 'dashboard' | 'create' | 'clients') => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'create' as const, label: 'Create Invoice' },
    { id: 'clients' as const, label: 'Clients' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-foreground">
              <Receipt className="w-[18px] h-[18px] text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">ClearLedger</span>
          </div>
          
          <nav className="hidden md:flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-foreground rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-full"
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Avatar className="h-9 w-9 cursor-pointer border-2 border-border">
            <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
              SA
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-card">
        <nav className="container mx-auto px-4 flex items-center py-2 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors text-center ${
                activeTab === tab.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
