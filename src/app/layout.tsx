import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vyloft",
  description: "",
  metadataBase: new URL("https://vyloft.fun"),
  openGraph: {
    title: "vyloft",
    description: "",
    url: "https://vyloft.fun",
    siteName: "vyloft",
    images: ["/vyloft.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vyloft",
    description: "",
    images: ["/vyloft.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
