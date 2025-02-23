import { newPostAction } from "@/app/actions";
import { SubmitButton } from "./submit-button";
import { AutosizeTextarea } from "./ui/autosize-textarea";
import { Button } from "./ui/button";
import { LucideImagePlus } from "lucide-react";
import { useState } from "react";

interface NewPostFormProps {
  type: "post" | "reply";
  parentPostId?: string;
}

export default function NewPostForm({ type, parentPostId }: NewPostFormProps) {
  const [content, setContent] = useState("");

  return (
    <form className="flex flex-col gap-2">
      <AutosizeTextarea
        className="resize-none rounded-xl"
        name="content"
        placeholder="What's on your mind?"
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="hidden"
        name="parent_post_id"
        value={parentPostId}
        readOnly
      />
      <div className="flex gap-2">
        <SubmitButton
          className="rounded-full"
          pendingText="Posting..."
          formAction={newPostAction}
          disabled={content.length > 320}
        >
          {type == "post" ? "Post" : "Reply"}
        </SubmitButton>
        <div className="flex-grow" />
        <Button
          className="gap-2 rounded-full"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <LucideImagePlus />
          Image
        </Button>
        <div
          className={`${content.length > 320 ? "border-destructive text-destructive" : ""} grid items-center rounded-full border px-4 text-sm`}
        >
          {content.length} / 320
        </div>
      </div>
    </form>
  );
}
