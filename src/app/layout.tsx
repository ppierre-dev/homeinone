import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import SessionProvider from "@/core/providers/SessionProvider";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import { QueryProvider } from "@/core/providers/QueryProvider";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display-var",
  subsets: ["latin"],
  weight: ["400"],
});

const dmSans = DM_Sans({
  variable: "--font-sans-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-var",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "HomeInOne",
  description: "PWA modulaire de gestion du quotidien familial",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HomeInOne",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // getLocale() reads from the request context set by next-intl middleware /
  // getRequestConfig. Falls back to defaultLocale when outside a request
  // (e.g. _global-error static prerendering).
  let locale = "fr";
  try {
    locale = await getLocale();
  } catch {
    // Outside of a request context — use default locale
  }

  return (
    <html
      lang={locale}
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#4a7c59" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* NextIntlClientProvider without explicit messages reads them from
            the server context established by getRequestConfig in
            src/i18n/request.ts. Messages are automatically forwarded to
            client components that call useTranslations(). */}
        <NextIntlClientProvider>
          <ThemeProvider>
            <QueryProvider>
              <SessionProvider>{children}</SessionProvider>
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
