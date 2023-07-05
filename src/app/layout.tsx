import Navbar from '../components/Navbar'
import Providers from '../components/Providers'
import { Toaster } from '../components/ui/toaster'
import { cn } from '../lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Breaddit',
  description: 'Reddit with some dough',
}

const inter = Inter({
  subsets: ['latin']
})

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('bg-white text-slate-900 antialiased', inter.className)}>
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        {/* bg-url[url('../public/images/br.jpg)] */}
          <Providers>
            {/* @ts-expect-error server component */}
            <Navbar />
            {authModal}
            <div className='container max-w-7xl mx-auto h-full pt-12'>
              {children}
            </div>
            <Toaster />
          </Providers>
      </body>
    </html>
  )
}
