import { newPostAction } from "@/app/actions";
import { SubmitButton } from "./submit-button";
import { AutosizeTextarea } from "./ui/autosize-textarea";
import { Button } from "./ui/button";
import { LucideImagePlus } from "lucide-react";
import { useState } from "react";

export default function NewPostForm() {
  const [content, setContent] = useState("");

  return (
    <form className="flex flex-col gap-2">
      <AutosizeTextarea
        className="resize-none"
        name="content"
        placeholder="Post something..."
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <SubmitButton
          pendingText="Posting..."
          formAction={newPostAction}
          disabled={content.length > 320}
        >
          Post
        </SubmitButton>
        <div className="flex-grow" />
        <Button
          className="gap-2"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <LucideImagePlus />
          Image
        </Button>
        <div
          className={`${content.length > 320 ? "border-destructive text-destructive" : ""} grid items-center rounded-md border px-4 text-sm`}
        >
          {content.length} / 320
        </div>
      </div>
    </form>
  );
}
