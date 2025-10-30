"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseClasses = "neo-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "neo-btn-primary",
      secondary: "neo-btn-secondary", 
      accent: "neo-btn-accent",
      destructive: "bg-red-500 text-white",
      outline: "bg-white text-black hover:bg-gray-100"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[36px]",
      md: "px-6 py-3 text-base min-h-[44px]", 
      lg: "px-8 py-4 text-lg min-h-[52px]"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

