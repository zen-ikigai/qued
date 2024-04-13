import '@/styles/global.css'
import Provider from '@/components/auth/Provider'
import Footer from '@/components/nav/Footer'
import '@/styles/background.scss'
import Nav from '@/components/nav/Nav'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'Qued',
  description: 'The next generation Task Management App.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/assets/logo.svg' />
      </head>
      <body>
        <Provider>
          <div className='app min-h-screen'>
            <Nav />
            <main className='flex-grow'>
              {children}
              <Analytics/>
              <SpeedInsights/>
            </main>
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  )
}
