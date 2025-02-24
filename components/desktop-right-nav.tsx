"use client";

import { LucideCommand, LucideOption } from "lucide-react";
import { Button } from "./ui/button";
import MiniUserLink from "./mini-user-link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "./ui/skeleton";

export default function DesktopRightNav() {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedProfiles, setSuggestedProfiles] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("suggested_profiles")
        .select("*");

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      setSuggestedProfiles(data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="sticky top-[4.75rem] hidden w-full flex-col gap-4 self-start lg:flex">
      <div className="flex flex-col gap-4 rounded-xl border p-3">
        <h3 className="-mb-1 text-lg font-medium">Who to Follow</h3>
        {!isLoading &&
          (suggestedProfiles.length > 0 ? (
            suggestedProfiles.map((profile) => (
              <MiniUserLink
                key={profile.id}
                username={profile.username}
                displayName={profile.display_name}
                isVerified={profile.is_verified}
                avatar={profile.avatar}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No suggested users.</p>
          ))}
        {isLoading && (
          <>
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </>
        )}
      </div>
      <div className="flex flex-col gap-1 rounded-xl border p-3">
        <h3 className="text-lg font-medium">Mobile View</h3>
        <p className="text-sm">
          Chirp was designed with mobile in mind, so you can use it on the go
          without any issues.
        </p>
        <p className="text-sm">
          Try it out on your phone or on your computer with{" "}
          <span className="inline-flex flex-row items-center gap-0.5">
            <LucideCommand className="h-3 w-3" />
            <LucideOption className="h-3 w-3" />
          </span>
          M!
        </p>
      </div>
      <div className="flex flex-col gap-1 rounded-xl border p-3">
        <h3 className="text-lg font-medium">No Premium Needed</h3>
        <p className="text-sm">
          Chirp is completely open and free, no need a subscription to
          artificially boost your posts or avoid censorship!
        </p>
        <Button variant="default" className="mt-2 rounded-full" disabled>
          Subscribe
        </Button>
      </div>
    </div>
  );
}
