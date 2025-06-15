import { Headphones } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

export function Header() {
  return (
    <header className="sticky top-0 flex items-center justify-between px-4 md:px-8 py-6 bg-background border-b border-border z-10 lg:relative">
      <div className="flex items-center gap-4">
        <Headphones className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">podcastr</h1>
      </div>
      <ModeToggle />
    </header>
  )
}
