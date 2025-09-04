import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/provider/QueryProvider";
import { ReduxProviders } from "@/provider/ReduxProvider";
import { PersistProviders } from "@/provider/PresistProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { PostHogProvider } from "@/provider/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Template",
  description: "Next Js starter template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ReduxProviders>
            <PersistProviders>
              <PostHogProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
              </PostHogProvider>
            </PersistProviders>
          </ReduxProviders>
        </QueryProvider>
      </body>
    </html>
  );
}
