import * as React from "react";

const Switch = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className = "", ...props }, ref) => {
  const classes = `toggle toggle-primary ${className}`;

  return <input type="checkbox" className={classes} ref={ref} {...props} />;
});
Switch.displayName = "Switch";

export { Switch };
