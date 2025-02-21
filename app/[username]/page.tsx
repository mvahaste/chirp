import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;

  // Fetch user data from supabase
  const supabase = await createClient();
  const result = await supabase
    .from("profiles")
    .select()
    .eq("username", username);

  if (result.error) {
    return <div>Error fetching user data.</div>;
  }

  if (result.data.length === 0) {
    return <div>User not found.</div>;
  }

  return (
    <pre className="rounded-md border p-3 text-xs">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}
