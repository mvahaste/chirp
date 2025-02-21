"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNav() {
  const pathname = usePathname();

  const links = {
    "/": "Home",
    "/profile": "Profile",
  };

  return (
    <>
      {Object.entries(links).map(([path, label]) => (
        <Link
          key={path}
          href={path}
          className={pathname == path ? "font-semibold" : ""}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
