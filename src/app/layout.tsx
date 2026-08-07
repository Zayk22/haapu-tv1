import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: "Haapu TV",
  description: "Watch amazing content for free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-matte-black antialiased">
        <ClerkProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}