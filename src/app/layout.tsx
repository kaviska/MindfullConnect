import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mindfull connect",
  description: "A real-time chat application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link
          type="text/css"
          rel="stylesheet"
          href="https://source.zoom.us/3.13.2/css/bootstrap.css"
        />
        <link
          type="text/css"
          rel="stylesheet"
          href="https://source.zoom.us/3.13.2/css/react-select.css"
        />
      </Head>
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
