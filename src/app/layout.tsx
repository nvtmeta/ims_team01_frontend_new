import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview management system",
  description: "Interview management system with many loves !",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="" />
      </Head>
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <NextTopLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
