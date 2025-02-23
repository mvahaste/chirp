"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkProps {
  username?: string;
}

export default function HeaderNav({ username }: LinkProps) {
  const pathname = usePathname();

  return (
    <>
      <Link href="/" className={pathname == "/" ? "font-semibold" : ""}>
        Home
      </Link>
      <Link
        href="/search"
        className={pathname == "/search" ? "font-semibold" : ""}
      >
        Search
      </Link>
      <Link
        href={"/" + (username || "login")}
        className={pathname == "/" + username ? "font-semibold" : ""}
      >
        Profile
      </Link>
      <Link
        href="/about"
        className={pathname == "/about" ? "font-semibold" : ""}
      >
        About
      </Link>
    </>
  );
}
