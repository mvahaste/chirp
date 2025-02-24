import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { avatarFallback } from "@/lib/utils";

interface MiniUserLinkProps {
  displayName: string;
  username: string;
  avatar?: string;
}

export default function MiniUserLink({
  displayName,
  username,
  avatar,
}: MiniUserLinkProps) {
  return (
    <Link href={"/" + username} className="flex flex-row items-center gap-3">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>{avatarFallback(displayName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-sm">
        <p className="font-medium">{displayName}</p>
        <p className="text-muted-foreground">@{username}</p>
      </div>
    </Link>
  );
}
