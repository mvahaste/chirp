"use client";

import { deletePostAction } from "@/app/actions";
import { Button } from "./ui/button";
import { useState } from "react";

interface PostProps {
  post: any;
}

export default function Post({ post }: PostProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className={`${visible ? "" : "hidden"} flex flex-col gap-4 rounded-lg border p-4`}
    >
      <pre key={post.id} className="rounded-md border p-3 text-xs">
        {JSON.stringify(post, null, 2)}
      </pre>
      <div className="flex flex-row gap-4">
        <Button>Like</Button>
        <Button>Reply</Button>
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
