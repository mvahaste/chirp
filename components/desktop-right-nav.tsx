import { LucideCommand, LucideOption } from "lucide-react";
import { Button } from "./ui/button";

export default function DesktopRightNav() {
  return (
    <div className="sticky top-[4.75rem] hidden w-full flex-col gap-4 self-start lg:flex">
      <div className="flex flex-col gap-1 rounded-xl border p-3">
        <h3 className="text-lg font-medium">No Premium Needed</h3>
        <p className="text-sm">
          Chirp is completely open and free, no need a subscription to
          artificially boost your posts or avoid censorship!
        </p>
        <Button variant="default" className="mt-2 rounded-full" disabled>
          Subscribe
        </Button>
      </div>
      <div className="flex flex-col gap-1 rounded-xl border p-3">
        <h3 className="text-lg font-medium">Mobile View</h3>
        <p className="text-sm">
          Chirp was designed with mobile in mind, so you can use it on the go
          without any issues.
        </p>
        <p className="text-sm">
          Try it out on your phone or on your computer with{" "}
          <span className="inline-flex flex-row items-center gap-0.5">
            <LucideCommand className="h-3 w-3" />
            <LucideOption className="h-3 w-3" />M
          </span>
          !
        </p>
      </div>
    </div>
  );
}
