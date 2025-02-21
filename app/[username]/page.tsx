import { createClient } from "@/utils/supabase/server";

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

  if (!data || data.length == 0) {
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
    <div>
      <p>User info</p>
      <pre className="rounded-md border p-3 text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
      <br />
      <p>User posts</p>
      <pre className="rounded-md border p-3 text-xs">
        {JSON.stringify(posts, null, 2)}
      </pre>
      <br />
      <p>User replies</p>
      <pre className="rounded-md border p-3 text-xs">
        {JSON.stringify(replies, null, 2)}
      </pre>
    </div>
  );
}
