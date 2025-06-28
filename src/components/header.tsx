import { Headphones } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-border border-b bg-background px-4 py-6 md:px-8 lg:relative">
      <div className="flex items-center gap-4">
        <Headphones className="h-8 w-8 text-primary" />
        <h1 className="font-bold text-2xl">podcastr</h1>
      </div>
      <ModeToggle />
    </header>
  );
}
