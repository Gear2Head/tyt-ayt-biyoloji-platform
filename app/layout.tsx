import type { Metadata } from "next";
import "./globals.css";
import { XanoAuthProvider } from "@/lib/xano/xano-auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalErrorBoundary } from "@/components/global-error-boundary";

export const metadata: Metadata = {
  title: "TYT-AYT Biyoloji | Profesyonel Eğitim Platformu",
  description: "MEB müfredatına uyumlu, AI destekli TYT-AYT biyoloji eğitim platformu. Kişisel çalışma planları, detaylı konu anlatımları ve AI destekli özetler.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalErrorBoundary>
            <XanoAuthProvider>
              {children}
            </XanoAuthProvider>
          </GlobalErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}

