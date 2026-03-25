import '../styles/globals.css'

export const metadata = {
  title: 'SEO Score Checker - Free Website Analysis',
  description: 'Check your website SEO score instantly. Get top issues and recommendations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
