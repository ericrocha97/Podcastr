import { FastForward, Play, Rewind, SkipBack, SkipForward } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Slider } from './ui/slider'

export function Player() {
  return (
    <aside
      className="
        fixed bottom-0 left-0 right-0 h-28 bg-card border-t border-border z-20
        flex items-center justify-between p-4 gap-6
        lg:relative lg:flex-col lg:w-[420px] lg:h-screen lg:border-l lg:border-t-0 lg:p-6 lg:justify-start"
    >
      <div className="flex items-center gap-4 lg:flex-col lg:pt-10">
        <Image
          src="/placeholder.jpg"
          alt="The Daily Grind"
          width={256}
          height={256}
          className="w-16 h-16 rounded object-cover lg:w-64 lg:h-64"
        />
        <div className="lg:mt-4 lg:text-center">
          <h3 className="font-medium">The Daily Grind</h3>
          <p className="text-sm text-muted-foreground hidden lg:block">
            Ethan Carter
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 lg:w-full lg:space-y-6 lg:mb-8">
        <div className="hidden lg:block w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">00:00</span>
            <span className="text-sm text-muted-foreground">30:00</span>
          </div>
          <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
        </div>
        <div className="flex items-center justify-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20"
          >
            <SkipBack className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20"
          >
            <Rewind className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="rounded-full w-10 h-10 lg:w-12 lg:h-12 bg-primary hover:bg-primary/90"
          >
            <Play className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20"
          >
            <FastForward className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20"
          >
            <SkipForward className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
