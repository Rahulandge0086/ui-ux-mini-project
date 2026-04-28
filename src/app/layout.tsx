import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import '@/globals.css'

export const metadata: Metadata = {
  title: 'Urban Cart - Your Online Shopping Destination',
  description: 'Shop the latest electronics, fashion, and home appliances at Urban Cart',
  icons: {
    icon: "/logo.png",            
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen bg-gray-light">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
