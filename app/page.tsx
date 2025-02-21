"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { newPostAction } from "./actions";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import Post from "@/components/post";

export default function Home() {
  const [posts, setPosts] = useState<any[] | null>(null);
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
          required
        />
        <SubmitButton pendingText="Posting..." formAction={newPostAction}>
          Post
        </SubmitButton>
      </form>
      <div className="flex flex-col gap-4">
        {posts?.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </main>
  );
}
