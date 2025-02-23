import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileNavBar from "@/components/mobile-nav-bar";
import { createClient } from "@/utils/supabase/server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const response = await supabase
    .from("get_current_username")
    .select("username");
  const username = response.data?.[0]?.username;

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <main className="flex min-h-screen flex-col items-center">
              <div className="flex w-full flex-1 flex-col items-center">
                <Header username={username} />
                <div className="flex w-full max-w-lg flex-grow flex-col p-5">
                  {children}
                </div>
              </div>
              <Footer />
              <MobileNavBar username={username} />
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
