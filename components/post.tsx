"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  deletePostAction,
  likePostAction,
  unlikePostAction,
} from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LucideHeart, LucideMessageCircle, LucideTrash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { avatarFallback, readableDate, timeAgo } from "@/lib/utils";

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
    (async () => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getSession();
      setIsSignedIn(!!auth.session?.user);
    })();
  }, []);

  const handleLike = async () => {
    if (!isSignedIn) return;
    const prevLiked = hasLiked;
    setHasLiked(!prevLiked);
    post.like_count += prevLiked ? -1 : 1;
    if (
      !(await (prevLiked
        ? unlikePostAction(post.post_id)
        : likePostAction(post.post_id)))
    ) {
      setHasLiked(prevLiked);
      post.like_count += prevLiked ? 1 : -1;
    }
  };

  const handleDelete = async () => {
    if (!isSignedIn) return;

    setVisible(false);

    if (!(await deletePostAction(post.post_id))) setVisible(true);
  };

  return (
    <article
      className={`${visible ? "" : "hidden"} overflow-hidden rounded-xl border p-4`}
    >
      <div className="flex gap-3">
        <Link href={`/${post.username}`} className="h-fit">
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
              href={`/${post.username}`}
              className="font-medium decoration-1 hover:underline"
            >
              {post.display_name}
            </Link>
            <Link
              href={`/${post.username}`}
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
          <p className="whitespace-pre-wrap break-all text-base">
            {post.content}
          </p>
          {post.image && (
            <img
              src={post.image}
              alt="Post image"
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          )}
          <div className="flex justify-between gap-4 pt-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`group flex items-center gap-2 text-muted-foreground transition-colors ${hasLiked ? "text-rose-500" : "hover:text-rose-500"}`}
                  onClick={handleLike}
                >
                  <LucideHeart
                    className={`h-4 w-4 transition-colors ${hasLiked ? "fill-rose-500" : ""}`}
                  />
                  <span className="text-sm">{post.like_count}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-sky-500">
                  <LucideMessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.reply_count}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reply</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`group flex items-center gap-2 text-muted-foreground transition-colors ${post.is_author ? "hover:text-red-500" : "pointer-events-none opacity-0"}`}
                  disabled={!post.is_author}
                  onClick={handleDelete}
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
