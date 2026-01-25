import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppHeader } from "@/shared/ui/appHeader";
import CommonRouter from "@/shared/ui/CommonRouter";

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
      <body className="h-dvh min-h-dvh flex flex-col">
        <Providers>
          <AppHeader />
          <main className="flex flex-col grow bg-slate-50 pb-8 pt-2" id="main-content">
            <CommonRouter>{children}</CommonRouter>
          </main>
        </Providers>
      </body>
    </html>
  );
}
