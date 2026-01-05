import { ThemeProvider } from "@/components/theme-provider"
import SessionProvider from "@/components/SessionProvider"
import { Toaster } from "sonner"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
        <head />
      <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <SessionProvider />
            {children}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
  )
}