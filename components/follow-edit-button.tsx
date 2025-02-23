"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { followUserAction, unfollowUserAction } from "@/app/actions";

interface FollowEditButtonProps {
  user_id: string;
  is_self: boolean;
  is_following: boolean;
}

export default function FollowEditButton({
  user_id,
  is_self,
  is_following,
}: FollowEditButtonProps) {
  const [isFollowing, setIsFollowing] = useState(is_following);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getSession();
      setIsSignedIn(!!auth.session?.user);
    })();
  }, []);

  const followEditText = () => {
    if (is_self) {
      return "Edit Profile";
    }

    if (isFollowing) {
      return "Following";
    } else {
      return "Follow";
    }
  };

  const handleFollow = async () => {
    if (!isSignedIn) return;
    const prevFollowing = isFollowing;

    setIsFollowing(!prevFollowing);

    if (
      !(await (prevFollowing
        ? unfollowUserAction(user_id)
        : followUserAction(user_id)))
    ) {
      setIsFollowing(prevFollowing);
    }
  };

  return (
    <Button
      className="absolute right-0"
      variant="outline"
      onClick={() => {
        if (is_self) {
          // Edit profile
        } else {
          handleFollow();
        }
      }}
    >
      {followEditText()}
    </Button>
  );
}
