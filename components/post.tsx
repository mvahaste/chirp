"use client";

import {
  deletePostAction,
  likePostAction,
  unlikePostAction,
} from "@/app/actions";
import { Button } from "./ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PostProps {
  post: any;
}

export default function Post({ post }: PostProps) {
  const [visible, setVisible] = useState(true);
  const [hasLiked, setHasLiked] = useState(post.has_liked);

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
    const weeks = days / 7;
    const months = weeks / 4;
    const years = months / 12;

    if (years >= 1) {
      return Math.floor(years) + "y";
    } else if (months >= 1) {
      return Math.floor(months) + "mo";
    } else if (weeks >= 1) {
      return Math.floor(weeks) + "w";
    } else if (days >= 1) {
      return Math.floor(days) + "d";
    } else if (hours >= 1) {
      return Math.floor(hours) + "h";
    } else if (minutes >= 1) {
      return Math.floor(minutes) + "m";
    } else {
      return Math.floor(seconds) + "s";
    }
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
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.avatar} alt={post.username} />
          <AvatarFallback>{avatarFallback(post.display_name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">{post.display_name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">@{post.username}</span>
                <span className="text-xs">•</span>
                <time className="text-sm">
                  {timeAgo(new Date(post.created_at))}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div>
        <p className="whitespace-pre">{post.content}</p>
      </div>
      {/* Interactions */}
      <div className="flex flex-row gap-4">
        <Button
          onClick={async () => {
            const result = hasLiked
              ? await unlikePostAction(post.id)
              : await likePostAction(post.id);

            const previousHasLiked = hasLiked;

            if (result) {
              setHasLiked(!hasLiked);

              if (previousHasLiked) {
                post.likes_count--;
              } else {
                post.likes_count++;
              }
            }
          }}
        >
          Like{hasLiked ? "d" : ""} ({post.likes_count})
        </Button>
        <Button>Reply ({post.replies_count})</Button>
        <div className="flex-grow" />
        {post.is_author && (
          <Button
            variant="destructive"
            onClick={async () => {
              const result = await deletePostAction(post.id);

              if (result) {
                setVisible(false);
              }
            }}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
