"use client";

import { deletePostAction, likePostAction, unlikePostAction } from "@/app/actions";
import { Button } from "./ui/button";
import { useState } from "react";

interface PostProps {
  post: any;
}

export default function Post({ post }: PostProps) {
  const [visible, setVisible] = useState(true);
  const [hasLiked, setHasLiked] = useState(post.has_liked);

  return (
    <div
      className={`${visible ? "" : "hidden"} flex flex-col gap-4 rounded-lg border p-4`}
    >
      <pre key={post.id} className="rounded-md border p-3 text-xs">
        {JSON.stringify(post, null, 2)}
      </pre>
      <div className="flex flex-row gap-4">
        <Button onClick={async () => {
          const result = hasLiked ? await unlikePostAction(post.id) : await likePostAction(post.id);

          const previousHasLiked = hasLiked;

          if (result) {
            setHasLiked(!hasLiked);

            if (previousHasLiked) {
              post.likes_count--;
            } else {
              post.likes_count++;
            }
          }
        }}>Like{hasLiked ? "d" : ""} ({post.likes_count})</Button>
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
