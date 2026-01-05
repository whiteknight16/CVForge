import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import SessionProvider from "@/components/SessionProvider"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "CVForge - Professional Resume Builder",
    template: "%s | CVForge"
  },
  description: "Create stunning, ATS-friendly resumes with CVForge. Build your professional resume with AI-powered suggestions, multiple templates, and easy customization. Download as PDF instantly.",
  keywords: [
    "resume builder",
    "CV maker",
    "professional resume",
    "ATS resume",
    "job application",
    "career tools",
    "resume templates",
    "AI resume",
    "free resume builder",
    "CVForge"
  ],
  authors: [{ name: "CVForge Team" }],
  creator: "CVForge",
  publisher: "CVForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "CVForge - Professional Resume Builder",
    description: "Create stunning, ATS-friendly resumes with CVForge. Build your professional resume with AI-powered suggestions, multiple templates, and easy customization.",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: "CVForge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CVForge - Professional Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVForge - Professional Resume Builder",
    description: "Create stunning, ATS-friendly resumes with CVForge. Build your professional resume with AI-powered suggestions.",
    images: ["/og-image.png"],
    creator: "@cvforge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
}

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