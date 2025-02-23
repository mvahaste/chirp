"use client";

import NewPostForm from "@/components/new-post-form";
import PostsFeed from "@/components/posts-feed";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getSession();
      setIsSignedIn(!!auth.session?.user);
    })();
  }, []);

  return (
    <main className="flex w-full flex-col gap-2">
      {isSignedIn && <NewPostForm />}
      <Tabs defaultValue="all">
        <TabsList className="mb-4 h-auto w-full rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="w-full rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="w-full rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PostsFeed type="all" />
        </TabsContent>
        <TabsContent value="following">
          <PostsFeed type="following" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
