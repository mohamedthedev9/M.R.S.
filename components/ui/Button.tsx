import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Chevrons } from "./Chevrons";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";
interface Common { variant?: Variant; size?: Size; chevron?: boolean; className?: string; children: React.ReactNode; "aria-label"?: string }
type LinkProps = Common & { href: string; onClick?: () => void };
type ButtonProps = Common & { href?: undefined; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean };

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-md font-medium whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,transform] duration-base ease-out active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-hover", // text on accent is --bg (6.3:1); white fails
  secondary: "border border-line-control text-ink hover:border-ink-muted hover:bg-surface-2",
  ghost: "text-ink-2 hover:text-ink",
};
const sizes: Record<Size, string> = { md: "min-h-11 px-5 text-sm", lg: "min-h-12 px-6 text-base" };

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", chevron = false, className, children } = props;
  const cls = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      {children}
      {chevron && <Chevrons className="h-3.5 w-3.5 transition-transform duration-base ease-out group-hover:translate-x-1" />}
    </>
  );

  if (props.href !== undefined) {
    const external = /^https?:\/\//.test(props.href);
    if (/^(mailto|tel):/.test(props.href))
      return <a href={props.href} className={cls} aria-label={props["aria-label"]} onClick={props.onClick}>{inner}</a>;
    return external ? (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={props["aria-label"]} onClick={props.onClick}>{inner}</a>
    ) : (
      <Link href={props.href} className={cls} aria-label={props["aria-label"]} onClick={props.onClick}>{inner}</Link>
    );
  }
  return (
    <button type={props.type ?? "button"} className={cls} disabled={props.disabled} onClick={props.onClick} aria-label={props["aria-label"]}>{inner}</button>
  );
}
