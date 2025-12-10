import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppHeader } from "@/shared/ui/appHeader";

export const metadata: Metadata = {
  title: "TCG 중고 거래",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AppHeader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
