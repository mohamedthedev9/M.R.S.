import { cn } from "@/lib/utils/cn";

export function Container({ as: Tag = "div", narrow = false, className, children }: {
  as?: "div" | "section" | "header" | "footer" | "main"; narrow?: boolean; className?: string; children: React.ReactNode;
}) {
  return <Tag className={cn("mx-auto w-full px-5 sm:px-8", narrow ? "max-w-3xl" : "max-w-site", className)}>{children}</Tag>;
}
