"use client";

import MiniUserLink from "@/components/mini-user-link";
import Post from "@/components/post";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [query, setQuery] = useState("");

  const [userResults, setUserResults] = useState<any>([]);
  const [isUserResultsLoading, setIsUserResultsLoading] = useState(false);
  const [postResults, setPostResults] = useState<any>([]);
  const [isPostResultsLoading, setIsPostResultsLoading] = useState(false);
  const [replyResults, setReplyResults] = useState<any>([]);
  const [isReplyResultsLoading, setIsReplyResultsLoading] = useState(false);

  const supabase = createClient();

  async function fetchUsers(query: string) {
    setIsUserResultsLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(
        `username.ilike.%${query}%, display_name.ilike.%${query}%, bio.ilike.%${query}%`,
      );

    if (error) {
      console.error(error);
    } else {
      setUserResults(data);
    }

    setIsUserResultsLoading(false);
  }

  async function fetchPosts(query: string) {
    setIsPostResultsLoading(true);

    const { data, error } = await supabase
      .from("post_feed")
      .select("*")
      .is("parent_post_id", null)
      .ilike("content", `%${query}%`);

    if (error) {
      console.error(error);
    } else {
      setPostResults(data);
    }

    setIsPostResultsLoading(false);
  }

  async function fetchReplies(query: string) {
    setIsReplyResultsLoading(true);

    const { data, error } = await supabase
      .from("post_feed")
      .select("*")
      .not("parent_post_id", "is", null)
      .ilike("content", `%${query}%`);

    if (error) {
      console.error(error);
    } else {
      setReplyResults(data);
    }

    setIsReplyResultsLoading(false);
  }

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    setIsTyping(true);

    setTypingTimeout(
      setTimeout(() => {
        if (query.length < 2) {
          return;
        }

        fetchUsers(query);
        fetchPosts(query);
        fetchReplies(query);

        setIsTyping(false);
      }, 1000),
    );

    return () => clearTimeout(typingTimeout);
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Type at least two characters..."
        className="rounded-xl"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      {/* Users */}
      {(isUserResultsLoading || userResults.length > 0) && (
        <div className="flex flex-col gap-2">
          <h3 className="flex flex-row items-end justify-between text-lg font-medium">
            Users{" "}
            {!isUserResultsLoading && (
              <span className="text-sm font-normal">
                {userResults.length} result
                {userResults.length !== 1 ? "s" : ""}
              </span>
            )}
          </h3>
          {!isUserResultsLoading &&
            userResults.map((user: any) => (
              <MiniUserLink
                key={user.id}
                username={user.username}
                displayName={user.display_name}
                avatar={user.avatar}
                isVerified={user.is_verified}
              />
            ))}
          {isUserResultsLoading && (
            <Skeleton className="h-16 w-full rounded-lg" />
          )}
        </div>
      )}
      {/* Posts */}
      {(isPostResultsLoading || postResults.length > 0) && (
        <div className="flex flex-col gap-2">
          <h3 className="flex flex-row items-end justify-between text-lg font-medium">
            Posts{" "}
            {!isPostResultsLoading && (
              <span className="text-sm font-normal">
                {postResults.length} result{postResults.length !== 1 ? "s" : ""}
              </span>
            )}
          </h3>
          {!isPostResultsLoading &&
            postResults.map((post: any) => (
              <Post key={post.post_id} post={post} />
            ))}
          {isPostResultsLoading && (
            <Skeleton className="h-28 w-full rounded-lg" />
          )}
        </div>
      )}
      {/* Replies */}
      {(isReplyResultsLoading || replyResults.length > 0) && (
        <div className="flex flex-col gap-2">
          <h3 className="flex flex-row items-end justify-between text-lg font-medium">
            Replies{" "}
            {!isReplyResultsLoading && (
              <span className="text-sm font-normal">
                {replyResults.length} result
                {replyResults.length !== 1 ? "s" : ""}
              </span>
            )}
          </h3>
          {!isReplyResultsLoading &&
            replyResults.map((reply: any) => (
              <Post key={reply.post_id} post={reply} />
            ))}
          {isReplyResultsLoading && (
            <Skeleton className="h-28 w-full rounded-lg" />
          )}
        </div>
      )}
      {!isPostResultsLoading &&
        postResults.length === 0 &&
        !isUserResultsLoading &&
        userResults.length === 0 &&
        !isReplyResultsLoading &&
        replyResults.length === 0 &&
        !isTyping && (
          <p className="text-center text-sm text-muted-foreground">
            No results found{query.length > 1 ? ' for "' + query + '"' : ""}.
          </p>
        )}
    </div>
  );
}
