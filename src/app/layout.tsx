import "./globals.css"
import { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>DotRewards - Collect Daily Rewards</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script async src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className="bg-black min-h-screen">
        {children}
      </body>
    </html>
  )
}