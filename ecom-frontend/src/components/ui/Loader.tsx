interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export function Loader({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p
            className={`${textSizeClasses[size]} text-muted-foreground font-medium animate-pulse`}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
