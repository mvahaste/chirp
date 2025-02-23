import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import {
  LucideCalendarDays,
  LucideHeart,
  LucideMapPin,
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

  const posts = await supabase
    .from("public_posts")
    .select()
    .eq("username", username)
    .is("parent_id", null);

  const replies = await supabase
    .from("public_posts")
    .select()
    .eq("username", username)
    .not("parent_id", "is", null);

  return (
    <main className="mx-auto max-w-2xl">
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
          <TabsTrigger
            value="bookmarks"
            className="flex-1 rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Bookmarks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <PostList />
        </TabsContent>
        <TabsContent value="replies" className="mt-6">
          <PostList />
        </TabsContent>
        <TabsContent value="likes" className="mt-6">
          <PostList />
        </TabsContent>
        <TabsContent value="bookmarks" className="mt-6">
          <PostList />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function PostList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((post) => (
        <article key={post} className="rounded-xl border p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="User avatar"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">John Doe</span>
                <span className="text-muted-foreground">@johndoe</span>
                <span className="text-muted-foreground">· 2h</span>
              </div>
              <p className="text-base">
                Just deployed my latest project using @vercel! The deployment
                experience is absolutely seamless. 🚀
              </p>
              <div className="flex flex-row justify-between gap-4 pt-1">
                <button
                  className={`${false ? "text-rose-500" : ""} group flex items-center gap-2 text-muted-foreground transition-colors hover:text-rose-500`}
                >
                  <LucideHeart
                    className={`${false ? "fill-rose-500" : ""} h-4 w-4 transition-colors`}
                  />
                  <span className="text-sm">{0}</span>
                </button>
                <button className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-sky-500">
                  <LucideMessageCircle className="h-4 w-4" />
                  <span className="text-sm">{0}</span>
                </button>
                {true && (
                  <button className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-red-500">
                    <LucideTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
