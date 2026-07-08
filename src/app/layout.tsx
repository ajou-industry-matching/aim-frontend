import type { Metadata } from "next";
import { AppLayout } from "./app-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIM AJOU",
  description: "AIM AJOU frontend",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      {
        url: `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/public%2Fassets%2Faim-logo.svg?alt=media`,
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.ico",
    apple: `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/public%2Fassets%2Faim-logo.svg?alt=media`,
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="ko">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
