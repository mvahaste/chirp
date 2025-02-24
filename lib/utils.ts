import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const avatarFallback = (name: string) => {
  if (name.split(" ").length > 1) {
    return (
      name.split(" ")[0].substring(0, 1) +
      name.split(" ")[1].substring(0, 1).toUpperCase()
    );
  } else {
    return name.substring(0, 1).toUpperCase();
  }
};

export const timeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (seconds < 5) {
    return "Just now";
  } else if (seconds < 60) {
    return Math.floor(seconds) + "s";
  } else if (minutes < 60) {
    return Math.floor(minutes) + "m";
  } else if (hours < 24) {
    return Math.floor(hours) + "h";
  } else if (days < 7) {
    return Math.floor(days) + "d";
  } else {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export const readableDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const shortNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num;
  }
};
