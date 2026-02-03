import * as React from "react";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className = "", children, ...props }, ref) => {
  const classes = `select select-bordered w-full ${className}`;

  return (
    <select className={classes} ref={ref} {...props}>
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
