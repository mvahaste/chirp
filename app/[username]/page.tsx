import FollowEditButton from "@/components/follow-edit-button";
import PostsFeed from "@/components/posts-feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { avatarFallback } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { LucideCalendarDays } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const supabase = await createClient();

  const username = (await params).username;

  const { data, error } = await supabase
    .from("profile_details")
    .select()
    .eq("username", username);

  if (error) {
    console.error(error);
    return (
      <p className="pt-6 text-center text-sm text-muted-foreground">
        Error fetching user data.
      </p>
    );
  }

  const profile = data[0];

  return (
    <main className="w-full">
      {/* Profile Header */}
      <div className="space-y-4">
        <div className="h-32 rounded-xl bg-muted" />
        <div className="relative">
          <Avatar className="absolute -top-16 left-4 h-32 w-32 border-4 border-background text-5xl">
            <AvatarImage
              src="/placeholder.svg?height=128&width=128"
              alt={profile ? profile.username : "Blank avatar"}
            />
            <AvatarFallback>
              {avatarFallback(profile ? profile.display_name : "")}
            </AvatarFallback>
          </Avatar>
          {profile && (
            <FollowEditButton
              user_id={profile.id}
              is_self={profile.is_self}
              is_following={profile.is_following_auth_user}
            />
          )}
          <div className="pb-4 pt-20">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">
                  {profile ? profile.display_name : "@" + username}
                </h1>
                {profile && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    @{profile.username}{" "}
                    {profile.is_following_me && (
                      <span className="mt-0.5 rounded bg-muted px-1.5 py-0.5 text-xs">
                        Follows you
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            {profile ? (
              <div className="mt-2 space-y-3 overflow-hidden">
                {profile.bio && (
                  <p className="whitespace-pre-wrap text-sm">{profile.bio}</p>
                )}
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
            ) : (
              <h3 className="px-2 pt-16 text-center text-3xl font-bold">
                This account doesn't exist.
              </h3>
            )}
          </div>
        </div>
      </div>
      {/* Tabs */}
      {profile && (
        <Tabs defaultValue="posts">
          <TabsList className="mb-2 h-auto w-full rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="w-full rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="w-full rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Replies
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="w-full rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Likes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostsFeed type="profile" profileType="posts" username={username} />
          </TabsContent>
          <TabsContent value="replies">
            <PostsFeed
              type="profile"
              profileType="replies"
              username={username}
            />
          </TabsContent>
          <TabsContent value="likes">
            <PostsFeed type="profile" profileType="likes" username={username} />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
