import './globals.css'

export const metadata = {
  title: 'Weather Dashboard',
  description: 'Real-time weather information dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  )
}
