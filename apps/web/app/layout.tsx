import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"

import { Providers } from "@/lib/providers"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "ResumAI | Tailored AI-Powered Resumes in Minutes",
  description:
    "AI-powered resume optimization that saves you hours and improves job match rates. Tailored resumes, ATS-ready, and designed for modern hiring pipelines.",
  generator: "v0.app",
  openGraph: {
    title: "ResumAI | Tailored AI-Powered Resumes in Minutes",
    description:
      "AI-powered resume optimization that saves you hours and improves job match rates. Tailored resumes, ATS-ready, and designed for modern hiring pipelines.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumAI | Tailored AI-Powered Resumes in Minutes",
    description:
      "AI-powered resume optimization that saves you hours and improves job match rates. Tailored resumes, ATS-ready, and designed for modern hiring pipelines.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ResumAI",
              description: "AI-powered resume optimization platform",
              url: "https://resumai.com",
              logo: "https://resumai.com/logo.png",
            }),
          }}
        />
      </head>
      <body className={`font-sans ${geistSans.variable} antialiased`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
