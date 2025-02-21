"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderNav() {
  const [username, setUsername] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const getUsername = async () => {
      const supabase = createClient();
      const user = await supabase.auth.getUser();
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.data.user?.id);

      if (data && data.length > 0) {
        setUsername(data[0].username);
      }
    };

    getUsername();
  }, []);

  const links = {
    "/": "Home",
    "<USERNAME>": "Profile",
  };

  return (
    <>
      {Object.entries(links).map(([path, label]) => (
        <Link
          key={path}
          href={path == "<USERNAME>" ? `/${username}` : path}
          className={pathname == path ? "font-semibold" : ""}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
