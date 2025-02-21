"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderNav() {
  const [username, setUsername] = useState<string>("");

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

  const links = [
    {
      path: "/",
      label: "Home",
    },
    {
      path: "/" + username,
      label: "Profile",
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className={pathname == link.path ? "font-semibold" : ""}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
