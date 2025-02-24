export default function AboutPage() {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-semibold">What is Chirp?</h2>
      <p>
        Chirp is a basic Twitter clone made with{" "}
        <a
          className="font-medium text-primary hover:underline"
          href="https://nextjs.org/"
        >
          Next.js 15
        </a>{" "}
        and{" "}
        <a
          className="font-medium text-primary hover:underline"
          href="https://supabase.com/"
        >
          Supabase
        </a>
        .
      </p>
      <p>
        Users can sign up and set a username, change their display name, bio,
        and create posts. They can also like other users' posts, reply to them
        or follow them.
      </p>
      <h2 className="mt-4 text-xl font-semibold">Why make this?</h2>
      <p>
        I made this to check out and learn{" "}
        <a
          className="font-medium text-primary hover:underline"
          href="https://supabase.com/"
        >
          Supabase
        </a>{" "}
        and to remind myself how to use SQL.
      </p>
      <p>
        I also wanted something that I could add to my resume, since most of my
        projects have to be private.
      </p>
      <h2 className="mt-4 text-xl font-semibold">How was it made?</h2>
      <p>Chirp was made using the following technologies</p>
      <ul dir="auto" className="list-disc pl-4">
        <li>
          <a
            href="https://nextjs.org/"
            className="font-medium text-primary hover:underline"
            rel="nofollow"
          >
            Next.js 15
          </a>{" "}
          for the frontend framework
        </li>
        <li>
          <a
            className="font-medium text-primary hover:underline"
            href="https://supabase.com/"
            rel="nofollow"
          >
            Supabase
          </a>{" "}
          for the backend
        </li>
        <li>
          <a
            className="font-medium text-primary hover:underline"
            href="https://ui.shadcn.com/"
            rel="nofollow"
          >
            shadcn/ui
          </a>{" "}
          for base UI components
        </li>
        <li>
          <a
            className="font-medium text-primary hover:underline"
            href="https://tailwindcss.com/"
            rel="nofollow"
          >
            TailwindCSS
          </a>{" "}
          for CSS
        </li>
        <li>
          <a
            className="font-medium text-primary hover:underline"
            href="https://vercel.com/"
            rel="nofollow"
          >
            Vercel
          </a>{" "}
          for the hosting
        </li>
      </ul>
    </div>
  );
}
