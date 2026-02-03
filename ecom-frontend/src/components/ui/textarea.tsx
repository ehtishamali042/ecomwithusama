import * as React from "react";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className = "", ...props }, ref) => {
  const classes = `textarea textarea-bordered w-full ${className}`;

  return <textarea className={classes} ref={ref} {...props} />;
});
Textarea.displayName = "Textarea";

export { Textarea };
