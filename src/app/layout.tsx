import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '@/app/layout/footer';
import Header from '@/app/layout/header';
import {AuthsProvider} from '@/context/AuthsContex';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auction demo',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthsProvider>
        <Header/>
        <main className="container mx-auto min-h-screen">
          {children}
        </main>
        <Footer/>
      </AuthsProvider>
      </body>
    </html>
  )
}
