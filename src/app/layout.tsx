import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Вайнахская Диаспора",
  description: "Единое пространство вайнахской диаспоры",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Вайнахская Диаспора",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFD" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1C1E" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="h-full font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
