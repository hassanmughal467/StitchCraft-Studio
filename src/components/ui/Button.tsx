import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-copper text-cream hover:bg-copper-dark focus-visible:outline-copper",
  secondary:
    "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-cream",
  ghost: "text-ink underline-offset-4 hover:underline",
  invert:
    "bg-ivory text-ink hover:bg-cream focus-visible:outline-ivory",
  invertGhost:
    "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory/5",
};

type Common = {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  external,
}: Common & { href: string; external?: boolean }) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center px-6 text-[0.8rem] font-medium tracking-[0.08em] uppercase transition-colors duration-200",
    variants[variant],
    className,
  );

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
      className={cn(
        "inline-flex min-h-12 items-center justify-center px-6 text-[0.8rem] font-medium tracking-[0.08em] uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
