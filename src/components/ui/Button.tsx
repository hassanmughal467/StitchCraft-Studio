import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-blue text-card hover:bg-blue-dark",
  secondary: "border border-charcoal/15 bg-card text-charcoal hover:bg-charcoal hover:text-card",
  ghost: "text-blue underline-offset-4 hover:underline",
  invert: "bg-card text-charcoal hover:bg-warm",
  invertGhost: "border border-card/40 text-card hover:bg-card/10",
};

type Common = {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
};

const base =
  "inline-flex min-h-12 items-center justify-center rounded-sm px-6 text-[0.82rem] font-semibold tracking-[0.04em] transition-colors duration-200";

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  external,
}: Common & { href: string; external?: boolean }) {
  const classes = cn(base, variants[variant], className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant], "disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      {children}
    </button>
  );
}
