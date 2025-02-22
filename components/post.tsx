"use client";

import {
  deletePostAction,
  likePostAction,
  unlikePostAction,
} from "@/app/actions";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  LucideBookmark,
  LucideHeart,
  LucideMessageCircle,
  LucideTrash,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface PostProps {
  post: any;
}

export default function Post({ post }: PostProps) {
  const [visible, setVisible] = useState(true);
  const [hasLiked, setHasLiked] = useState(post.has_liked);
  const [hasBookmarked, setHasBookmarked] = useState(
    post.has_bookmarked ?? false,
  );
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const user = await supabase.auth.getUser();

      if (user.data.user) {
        setIsSignedIn(true);
      }
    };

    checkAuth();
  }, []);

  const avatarFallback = (name: string) => {
    if (name.split(" ").length > 1) {
      return (
        name.split(" ")[0].substring(0, 1) + name.split(" ")[1].substring(0, 1)
      );
    } else {
      return name.substring(0, 2);
    }
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (seconds < 5) {
      return "Just now";
    } else if (seconds < 60) {
      return Math.floor(seconds) + "s";
    } else if (minutes < 60) {
      return Math.floor(minutes) + "m";
    } else if (hours < 24) {
      return Math.floor(hours) + "h";
    } else if (days < 7) {
      return Math.floor(days) + "d";
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const readableDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const shortNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num;
    }
  };

  return (
    <article
      key={post.id}
      className={`${visible ? "" : "hidden"} rounded-xl border p-4`}
    >
      <div className="flex gap-3">
        <Link href={"/" + post.username} className="h-fit">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="User avatar"
            />
            <AvatarFallback>{avatarFallback(post.display_name)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={"/" + post.username}
              className="font-semibold decoration-1 hover:underline"
            >
              {post.display_name}
            </Link>
            <Link
              href={"/" + post.username}
              className="text-muted-foreground decoration-1 hover:underline"
            >
              @{post.username}
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-muted-foreground">
                  · {timeAgo(new Date(post.created_at))}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{readableDate(new Date(post.created_at))}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="whitespace-pre text-base">{post.content}</p>
          <div className="flex flex-row justify-between gap-4 pt-1">
            {/* Like */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`${hasLiked ? "text-rose-500" : ""} group flex items-center gap-2 text-muted-foreground transition-colors hover:text-rose-500`}
                  onClick={async () => {
                    // Do nothing if the user is not signed in
                    if (!isSignedIn) {
                      return;
                    }

                    // Remember the current state
                    const currentState = hasLiked;

                    // Optimistically update the UI
                    if (hasLiked) {
                      setHasLiked(false);
                      post.likes_count -= 1;
                    } else {
                      setHasLiked(true);
                      post.likes_count += 1;
                    }

                    // Update the database
                    const result = currentState
                      ? await unlikePostAction(post.id)
                      : await likePostAction(post.id);

                    if (!result) {
                      // Revert to the previous state if the request fails
                      setHasLiked(currentState);

                      post.likes_count = currentState
                        ? post.likes_count + 1
                        : post.likes_count - 1;
                    }
                  }}
                >
                  <LucideHeart
                    className={`${hasLiked ? "fill-rose-500" : ""} h-4 w-4 transition-colors`}
                  />
                  <span className="text-sm">{post.likes_count}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
            {/* Reply */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-sky-500"
                  onClick={() => {
                    // Do nothing if the user is not signed in
                    if (!isSignedIn) {
                      return;
                    }
                  }}
                >
                  <LucideMessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.replies_count}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reply</p>
              </TooltipContent>
            </Tooltip>
            {/* Bookmark */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`${hasBookmarked ? "text-green-500" : ""} group flex items-center gap-2 text-muted-foreground transition-colors hover:text-green-500`}
                  onClick={async () => {
                    // Do nothing if the user is not signed in
                    if (!isSignedIn) {
                      return;
                    }

                    // TODO: Implement bookmarking

                    // Remember the current state
                    const currentState = hasBookmarked;

                    // Optimistically update the UI
                    if (hasBookmarked) {
                      setHasBookmarked(false);
                      // post.bookmarks_count -= 1;
                    } else {
                      setHasBookmarked(true);
                      // post.likes_count += 1;
                    }

                    // Update the database
                    // const result = currentState
                    //   ? await unbookmarkPostAction(post.id)
                    //   : await bookmarkPostAction(post.id);

                    // if (!result) {
                    //   // Revert to the previous state if the request fails
                    //   setHasBookmarked(currentState);
                    //
                    //   post.bookmarks_count = currentState
                    //     ? post.bookmarks_count + 1
                    //     : post.bookmarks_count - 1;
                    // }
                  }}
                >
                  <LucideBookmark
                    className={`${hasBookmarked ? "fill-green-500" : ""} h-4 w-4 transition-colors`}
                  />
                  <span className="text-sm">{post.bookmarks_count ?? 0}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bookmark</p>
              </TooltipContent>
            </Tooltip>
            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`${post.is_author ? "" : "pointer-events-none opacity-0"} group flex items-center gap-2 text-muted-foreground transition-colors hover:text-red-500`}
                  disabled={!post.is_author}
                  onClick={async () => {
                    // Do nothing if the user is not signed in
                    if (!isSignedIn) {
                      return;
                    }

                    // Optimistically update the UI
                    setVisible(false);

                    // Update the database
                    const result = await deletePostAction(post.id);

                    if (!result) {
                      // Revert to the previous state if the request fails
                      setVisible(true);
                    }
                  }}
                >
                  <LucideTrash className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </article>
  );
}
