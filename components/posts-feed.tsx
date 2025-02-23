"use client";

import { useEffect, useState } from "react";
import Post from "./post";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "./ui/skeleton";

interface PostsFeedProps {
  /**
   * The type of posts to display.
   *
   * - `all`: All posts.
   * - `following`: Posts from users you follow.
   * - `replies`: Posts that are replies to current post (requires `postId`).
   * - `profile`: Posts on a user's profile (requires `profileType` and `username`).
   */
  type: "all" | "following" | "replies" | "profile";
  /**
   * The type of posts to display when `type` is `profile`.
   *
   * - `posts`: Posts by the user.
   * - `replies`: Replies by the user.
   * - `likes`: Likes by the user.
   */
  profileType?: "posts" | "replies" | "likes";
  /**
   * The username of the user whose feed to display when `type` is `profile`.
   */
  username?: string;
  /**
   * The ID of the post to display replies to when `type` is `replies`.
   */
  postId?: string;
}

export default function PostsFeed({
  type,
  profileType,
  username,
  postId,
}: PostsFeedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient();

      let response;

      if (type == "all") {
        response = await supabase.from("post_feed").select("*");
      } else if (type == "following") {
        response = await supabase.from("followed_post_feed").select("*");
      } else if (type == "replies") {
        response = await supabase
          .from("post_feed")
          .select("*")
          .eq("parent_post_id", postId);
      } else if (type == "profile") {
        if (profileType == "posts") {
          response = await supabase
            .from("post_feed")
            .select("*")
            .eq("username", username)
            .is("parent_post_id", null);
        } else if (profileType == "replies") {
          response = await supabase
            .from("post_feed")
            .select("*")
            .eq("username", username)
            .not("parent_post_id", "is", null);
        } else if (profileType == "likes") {
          response = await supabase.rpc("get_liked_posts_by_user", {
            username_input: username,
          });
        }
      }

      if (response?.error) {
        console.error(response.error);
        return;
      }

      setPosts(response?.data);
      setIsLoading(false);
    }

    fetchPosts();
  }, []);

  const noResultsText = () => {
    if (type === "all") return "No posts to display.";
    if (type === "following") return "No posts from users you follow.";
    if (type === "replies") return "No replies to this post.";
    if (type === "profile") {
      if (profileType === "posts") return "No posts to display.";
      if (profileType === "replies") return "No replies to display.";
      if (profileType === "likes") return "No likes to display.";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!isLoading &&
        (posts.length > 0 ? (
          posts.map((post: any) => <Post key={post.post_id} post={post} />)
        ) : (
          <p className="pt-6 text-center text-sm text-muted-foreground">
            {noResultsText()}
          </p>
        ))}
      {isLoading && (
        <>
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg opacity-80" />
          <Skeleton className="h-28 w-full rounded-lg opacity-60" />
          <Skeleton className="h-28 w-full rounded-lg opacity-40" />
          <Skeleton className="h-28 w-full rounded-lg opacity-20" />
        </>
      )}
    </div>
  );
}
