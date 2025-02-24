import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { avatarFallback } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { LucideBadgeCheck } from "lucide-react";

interface MiniUserLinkProps {
  displayName: string;
  username: string;
  isVerified?: boolean;
  avatar?: string;
}

export default function MiniUserLink({
  displayName,
  username,
  isVerified,
  avatar,
}: MiniUserLinkProps) {
  return (
    <Link href={"/" + username} className="flex flex-row items-center gap-3">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>{avatarFallback(displayName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-sm">
        <div className="inline-flex items-center gap-1">
          <p className="font-medium">{displayName}</p>
          {isVerified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <LucideBadgeCheck className="h-4 w-4 stroke-[2.5] text-primary" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-normal">This user is verified.</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-muted-foreground">@{username}</p>
      </div>
    </Link>
  );
}
