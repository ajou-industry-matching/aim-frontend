import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIM AJOU",
  description: "AIM AJOU frontend",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/ajou-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/assets/ajou-logo.svg",
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
