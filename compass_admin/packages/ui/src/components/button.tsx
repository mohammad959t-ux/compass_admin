import * as React from "react";

import { cn } from "../lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent-from to-accent-to text-white shadow-soft hover:brightness-110",
  secondary: "bg-text text-bg hover:bg-text/90",
  outline: "border border-border text-text hover:bg-muted",
  ghost: "text-text hover:bg-muted",
  danger: "bg-danger text-white hover:bg-danger/90"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      asChild,
      disabled,
      children,
      ...props
    },
    ref
  ) => (
    asChild && React.isValidElement(children) ? (
      React.cloneElement(children as React.ReactElement, {
        className: cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-from/50",
          variantStyles[variant],
          sizeStyles[size],
          className,
          (children as React.ReactElement<{ className?: string }>).props
            .className
        ),
        ...props
      })
    ) : (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-from/50 disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {variant === "primary" ? (
          <div className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[120%] motion-safe:animate-[shimmer_2s_infinite]" />
        ) : null}
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  )
);

Button.displayName = "Button";
