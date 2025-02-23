"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { followUserAction, unfollowUserAction } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitButton } from "./submit-button";

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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="absolute right-0 rounded-full"
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Edit your display name, bio, avatar, and cover image.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-1.5 [&>input]:mb-3">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" placeholder="Your name" />
          <Label htmlFor="bio">Bio</Label>
          <Input name="bio" type="text" placeholder="A little about yourself" />
          <Label htmlFor="avatar">Avatar</Label>
          <Input
            name="avatar"
            type="file"
            placeholder="https://example.com/avatar.png"
          />
          <Label htmlFor="cover">Cover</Label>
          <Input
            name="cover"
            type="file"
            placeholder="https://example.com/cover.png"
          />
          <SubmitButton
            formAction=""
            pendingText="Saving..."
            className="rounded-full"
          >
            Save
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
