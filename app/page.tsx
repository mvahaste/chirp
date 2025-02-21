"use client";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { newPostAction } from "./actions";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

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
    <main className="flex flex-1 flex-col gap-4">
      <form className="flex flex-col gap-2">
        <AutosizeTextarea
          name="content"
          placeholder="Post something..."
          required
        />
        <SubmitButton pendingText="Posting..." formAction={newPostAction}>
          Post
        </SubmitButton>
      </form>
      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <pre key={post.id} className="rounded-lg border p-3 text-xs">
            {JSON.stringify(post, null, 2)}
          </pre>
        ))}
      </div>
    </main>
  );
}
