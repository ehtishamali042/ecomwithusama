import * as React from "react";
import Spinner from "../../assets/svg/Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = "btn no-animation";
    const variantClasses: Record<
      NonNullable<ButtonProps["variant"]>,
      string
    > = {
      default: "btn-primary",
      outline: "btn-outline",
      ghost: "btn-ghost",
    };
    const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
      default: "btn-md",
      sm: "btn-sm",
      lg: "btn-lg",
    };
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button
        className={classes}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? <Spinner /> : <span>{children}</span>}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
