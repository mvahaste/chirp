"use client";

import {
  deletePostAction,
  likePostAction,
  unlikePostAction,
} from "@/app/actions";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LucideHeart, LucideMessageCircle, LucideTrash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface PostProps {
  post: any;
}

export default function Post({ post }: PostProps) {
  const [visible, setVisible] = useState(true);
  const [hasLiked, setHasLiked] = useState(post.has_liked);
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
    <div
      className={`${visible ? "" : "hidden"} flex flex-col gap-4 rounded-lg border p-4`}
    >
      {/* <pre key={post.id} className="rounded-md border p-3 text-xs"> */}
      {/*   {JSON.stringify(post, null, 2)} */}
      {/* </pre> */}
      {/* Author info */}
      <Link className="group flex items-start gap-3" href={"/" + post.username}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.avatar} alt={post.username} />
          <AvatarFallback>{avatarFallback(post.display_name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium decoration-1 group-hover:underline">
                {post.display_name}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">@{post.username}</span>
                <span className="text-xs">•</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <time className="text-sm">
                      {timeAgo(new Date(post.created_at))}
                    </time>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{readableDate(new Date(post.created_at))}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* Content */}
      <div className="text-sm">
        <p className="whitespace-pre">{post.content}</p>
      </div>
      {/* Interactions */}
      <div className="flex flex-row gap-4">
        <div className="flex items-center gap-6">
          <button
            className={`${hasLiked ? "text-rose-500" : ""} group flex items-center gap-2 text-muted-foreground transition-colors hover:text-rose-500`}
            onClick={async () => {
              if (!isSignedIn) {
                return;
              }

              // Update the UI optimistically
              setHasLiked(!hasLiked);
              post.likes_count += hasLiked ? -1 : 1;

              // Update the server
              const result = hasLiked
                ? await unlikePostAction(post.id)
                : await likePostAction(post.id);

              // If the server update fails, revert the UI
              if (!result) {
                setHasLiked(hasLiked);
                post.likes_count += hasLiked ? 1 : -1;
              }
            }}
          >
            <LucideHeart
              className={`${hasLiked ? "fill-rose-500" : ""} h-4 w-4 transition-colors`}
            />
            <span className="text-sm">{post.likes_count}</span>
          </button>
          <button
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-sky-500"
            onClick={() => {
              if (!isSignedIn) {
                return;
              }
            }}
          >
            <LucideMessageCircle className="h-4 w-4" />
            <span className="text-sm">{post.replies_count}</span>
          </button>
        </div>
        <div className="flex-grow" />
        {post.is_author && (
          <button
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-red-500"
            onClick={async () => {
              const result = await deletePostAction(post.id);

              if (result) {
                setVisible(false);
              }
            }}
          >
            <LucideTrash className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
