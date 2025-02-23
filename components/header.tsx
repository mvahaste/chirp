import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Bird } from "lucide-react";
import Link from "next/link";
import { EnvVarWarning } from "./env-var-warning";
import HeaderAuth from "./header-auth";
import HeaderNav from "./header-nav";

export default function Header() {
  return (
    <header className="border-grid sticky top-0 z-50 flex h-16 w-full justify-center border-b border-b-foreground/10 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={"/"} className="inline-flex items-center gap-3">
            <Bird /> Chirp
          </Link>
        </div>
        <div className="flex flex-row items-center gap-8">
          <div className="hidden flex-row items-center gap-8 sm:flex">
            <HeaderNav />
          </div>
          {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
        </div>
      </div>
    </header>
  );
}
