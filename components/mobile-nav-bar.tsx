"use client";

import { LucideHome, LucideInfo, LucideSearch, LucideUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavBarProps {
  username?: string;
}

export default function MobileNavBar({ username }: MobileNavBarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 z-50 flex w-full bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      {/* Home */}
      <Link
        href="/"
        className={`${pathname == "/" ? "border-t-2 border-foreground" : "border-t border-foreground/10"} flex w-full items-center justify-center gap-3 py-4`}
      >
        <LucideHome />
      </Link>
      {/* Search */}
      <Link
        href="/search"
        className={`${pathname == "/search" ? "border-t-2 border-foreground" : "border-t border-foreground/10"} flex w-full items-center justify-center gap-3 py-4`}
      >
        <LucideSearch />
      </Link>
      {/* Profile */}
      <Link
        href={"/" + (username || "sign-in")}
        className={`${pathname == "/" + username ? "border-t-2 border-foreground" : "border-t border-foreground/10"} flex w-full items-center justify-center gap-3 py-4`}
      >
        <LucideUser />
      </Link>
      {/* About */}
      <Link
        href="/about"
        className={`${pathname == "/about" ? "border-t-2 border-foreground" : "border-t border-foreground/10"} flex w-full items-center justify-center gap-3 py-4`}
      >
        <LucideInfo />
      </Link>
    </div>
  );
}
