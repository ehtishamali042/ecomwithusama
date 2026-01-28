import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className = "", type, ...props }, ref) => {
    const classes = `input input-bordered w-full ${className}`;

    return <input type={type} className={classes} ref={ref} {...props} />;
  },
);
Input.displayName = "Input";

export { Input };
