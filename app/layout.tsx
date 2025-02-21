import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Bird } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Chirp",
  description: "The best bird-themed social media platform.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center">
              <header className="border-grid sticky top-0 z-50 flex h-16 w-full justify-center border-b border-b-foreground/10 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                  <div className="flex items-center gap-5 font-semibold">
                    <Link href={"/"} className="inline-flex items-center gap-3"><Bird /> Chirp</Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </header>
              <div className="flex max-w-5xl flex-grow flex-col p-5">
                {children}
              </div>
              <footer className="mx-auto flex w-full items-center justify-center gap-6 pb-4 pt-8 text-center text-xs">
                <p>
                  View the source code on{" "}
                  <a
                    href="https://github.com/mvahaste/chirp"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
