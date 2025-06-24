import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Player } from '@/components/player'
import { PlayerProvider } from '@/components/player-provider'
import { ThemeProvider } from '@/components/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Podcastr',
  description: 'Seu player de podcast!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Podcastr" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PlayerProvider>
            <div className="lg:flex lg:h-screen lg:overflow-hidden bg-background">
              <div className="lg:flex-1 lg:flex lg:flex-col">
                <Header />
                {children}
              </div>
              <Player />
            </div>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
