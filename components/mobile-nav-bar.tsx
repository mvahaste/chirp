"use client";

import { createClient } from "@/utils/supabase/client";
import { LucideHome, LucideInfo, LucideSearch, LucideUser } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MobileNavBar() {
  const [username, setUsername] = useState<string>("");

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

  return (
    <div className="sticky bottom-0 z-50 flex h-16 w-full justify-center border-t border-foreground/10 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-8 text-sm">
        <Link href="/" className="inline-flex items-center gap-3">
          <LucideHome />
        </Link>
        <Link href="/search" className="inline-flex items-center gap-3">
          <LucideSearch />
        </Link>
        <Link href={"/" + username} className="inline-flex items-center gap-3">
          <LucideUser />
        </Link>
        <Link href="/about" className="inline-flex items-center gap-3">
          <LucideInfo />
        </Link>
      </div>
    </div>
  );
}
