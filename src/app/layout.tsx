import type { Metadata } from 'next'
import { Playfair_Display, Poppins } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import { siteUrl } from '@/data/site'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const description =
  'Ashna Mary — 2D designer for corporate events and weddings: stage and LED backdrops, entry ' +
  'arches, registration desks, event collaterals and wedding stationery, presented as 3D mock-ups.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ashna Mary | 2D Designer — Event & Wedding Design',
  description,
  openGraph: {
    type: 'website',
    siteName: 'Ashna Mary',
    title: 'Ashna Mary | 2D Event & Wedding Designer',
    description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashna Mary | 2D Event & Wedding Designer',
    description,
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <div className="scroll-progress" aria-hidden="true" />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  )
}
