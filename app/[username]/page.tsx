import Post from "@/components/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import {
  LucideCalendarDays,
  LucideHeart,
  LucideMessageCircle,
  LucideTrash,
} from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;

  // Fetch user data from supabase
  const supabase = await createClient();
  const { error, data } = await supabase
    .from("profiles")
    .select()
    .eq("username", username);

  if (error) {
    return <div>Error fetching user data.</div>;
  }

  const profile = data && data.length > 0 ? data[0] : null;

  if (!profile) {
    return <div>User not found.</div>;
  }

  const { data: posts, error: postsError } = await supabase
    .from("public_posts")
    .select()
    .eq("username", username)
    .is("parent_id", null);

  const { data: replies, error: repliesError } = await supabase
    .from("public_posts")
    .select()
    .eq("username", username)
    .not("parent_id", "is", null);

  // Get likes from the supabase get_liked_posts_by_username function

  const { data: likes, error: likesError } = await supabase.rpc(
    "get_liked_posts_by_username",
    {
      p_username: username,
    },
  );

  return (
    <main className="w-full">
      {/* Profile Header */}
      <div className="space-y-4">
        <div className="h-32 rounded-xl bg-muted" />
        <div className="relative">
          <Avatar className="absolute -top-16 left-4 h-32 w-32 border-4 border-background">
            <AvatarImage
              src="/placeholder.svg?height=128&width=128"
              alt={profile.username}
            />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className="pb-4 pt-20">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>
              <Button variant="outline">Edit profile</Button>
            </div>
            <div className="mt-4 space-y-3">
              <p className="whitespace-pre text-base">{profile.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {/* <div className="flex items-center gap-1"> */}
                {/*   <LucideMapPin className="h-4 w-4" /> */}
                {/*   San Francisco, CA */}
                {/* </div> */}
                <div className="flex items-center gap-1">
                  <LucideCalendarDays className="h-4 w-4" />
                  Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">2,345</span>
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">12.3K</span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="mt-4">
        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="posts"
            className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Replies
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Likes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          {posts?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No posts yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts?.map((post) => <Post key={post.id} post={post} />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="replies" className="mt-6">
          {replies?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No replies yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {replies?.map((post) => <Post key={post.id} post={post} />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="likes" className="mt-6">
          {likes?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No liked posts yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {likes?.map((post: any) => <Post key={post.id} post={post} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
