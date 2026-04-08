import { type HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-card border border-card-border rounded-card shadow-card",
        "overflow-hidden",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }: CardHeaderProps) {
  return (
    <div
      className={["flex flex-col gap-1.5 p-4 pb-0", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ className = "", children, ...props }: CardTitleProps) {
  return (
    <h3
      className={[
        "text-base font-semibold text-foreground leading-snug",
        "font-display",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardContent({ className = "", children, ...props }: CardContentProps) {
  return (
    <div className={["p-4", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className = "", children, ...props }: CardFooterProps) {
  return (
    <div
      className={[
        "flex items-center p-4 pt-0 gap-2",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
