import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import { CoreLayout } from "../components/layouts/CoreLayoutComponent";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slick Solutions",
  description: "Generate your Assessment using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <CoreLayout>
      <html lang="en">
          <body className={`${manrope.className}`}>
              {children}
          </body>
      </html>
      </CoreLayout>
    </ConvexClerkProvider>
  );
}