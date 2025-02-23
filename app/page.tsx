"use client";

import { SubmitButton } from "@/components/submit-button";
import { newPostAction } from "./actions";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import Post from "@/components/post";
import { LucideImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [posts, setPosts] = useState<any[] | null>(null);
  const [input, setInput] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const getPosts = async () => {
      const { data } = await supabase.from("public_posts").select();
      console.log(data);

      setPosts(data);
    };

    getPosts();
  }, []);

  return (
    <main className="flex w-full flex-col gap-4">
      <form className="flex flex-col gap-2">
        <AutosizeTextarea
          className="resize-none"
          name="content"
          placeholder="Post something..."
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <SubmitButton
            pendingText="Posting..."
            formAction={newPostAction}
            disabled={input.length > 320}
          >
            Post
          </SubmitButton>
          <div className="flex-grow" />
          <Button
            className="gap-2"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <LucideImagePlus />
            Image
          </Button>
          <div
            className={`${input.length > 320 ? "border-destructive text-destructive" : ""} grid items-center rounded-md border px-4 text-sm`}
          >
            {input.length} / 320
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-4">
        {posts?.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </main>
  );
}
