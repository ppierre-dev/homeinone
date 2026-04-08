import { forwardRef, InputHTMLAttributes, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, disabled = false, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground leading-none"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? descriptionId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={[
            "w-full h-11 px-3 text-sm",
            "bg-card text-foreground placeholder:text-foreground-muted",
            "border rounded-btn",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:border-primary",
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-card-border",
            disabled
              ? "opacity-50 cursor-not-allowed bg-card/50"
              : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {hint && !error && (
          <p id={descriptionId} className="text-xs text-foreground-muted">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
