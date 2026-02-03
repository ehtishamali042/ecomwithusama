import * as React from "react";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className = "", ...props }, ref) => {
  const classes = `checkbox ${className}`;

  return <input type="checkbox" className={classes} ref={ref} {...props} />;
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
