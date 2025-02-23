import Post from "@/components/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import { LucideCalendarDays } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("public_profiles")
    .select()
    .eq("username", params.username)
    .single();

  if (error || !profile)
    return <div>{error ? "Error fetching user data." : "User not found."}</div>;

  const fetchPosts = async (filter: object) => {
    const { data, error } = await supabase
      .from("public_posts")
      .select()
      .match(filter);
    return error ? [] : data;
  };

  const [posts, replies, likes] = await Promise.all([
    fetchPosts({ username: params.username, parent_id: null }),
    fetchPosts({ username: params.username, parent_id: { neq: null } }),
    supabase
      .rpc("get_liked_posts_by_username", { p_username: params.username })
      .then(({ data }) => data || []),
  ]);

  const followEditText = () => {
    if (profile.is_self) {
      return "Edit Profile";
    }

    if (profile.is_following) {
      return "Following";
    } else {
      return "Follow";
    }
  };

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
                <p className="flex items-center gap-2 text-muted-foreground">
                  @{profile.username}{" "}
                  {profile.is_following_me && (
                    <span className="mt-0.5 rounded bg-muted px-1.5 py-0.5 text-xs">
                      Follows you
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (profile.is_self) {
                    // Edit profile
                  } else {
                    // Follow/unfollow
                  }
                }}
              >
                {followEditText()}
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              <p className="whitespace-pre text-base">{profile.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                  <span className="font-semibold text-foreground">
                    {profile.following_count}
                  </span>
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {profile.followers_count}
                  </span>
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
          {["posts", "replies", "likes"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {[
          ["posts", posts],
          ["replies", replies],
          ["likes", likes],
        ].map(([key, data]) => (
          <TabsContent key={key} value={key} className="mt-6">
            {data.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No {key} yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {data.map((post: any) => (
                  <Post key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
