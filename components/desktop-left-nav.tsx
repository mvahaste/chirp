"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LucideHome, LucideInfo, LucideSearch, LucideUser } from "lucide-react";
import { usePathname } from "next/navigation";

interface DesktopLeftNavProps {
  username?: string;
}

export default function DesktopLeftNav({ username }: DesktopLeftNavProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-[4.75rem] hidden w-full flex-col gap-2 self-start lg:flex">
      <Button variant="ghost" asChild className="justify-start rounded-full">
        <Link
          href="/"
          className={`${pathname == "/" ? "font-[650]" : ""} flex flex-row items-center gap-2`}
        >
          <LucideHome /> Home
        </Link>
      </Button>
      <Button variant="ghost" asChild className="justify-start rounded-full">
        <Link
          href="/search"
          className={`${pathname == "/search" ? "font-[650]" : ""} flex flex-row items-center gap-2`}
        >
          <LucideSearch /> Search
        </Link>
      </Button>
      <Button variant="ghost" asChild className="justify-start rounded-full">
        <Link
          href={"/" + username}
          className={`${pathname == "/" + username ? "font-[650]" : ""} flex flex-row items-center gap-2`}
        >
          <LucideUser /> Profile
        </Link>
      </Button>
      <Button variant="ghost" asChild className="justify-start rounded-full">
        <Link
          href="/about"
          className={`${pathname == "/about" ? "font-[650]" : ""} flex flex-row items-center gap-2`}
        >
          <LucideInfo /> About
        </Link>
      </Button>
    </div>
  );
}
