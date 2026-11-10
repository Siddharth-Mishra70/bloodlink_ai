/**
 * @file Input.jsx
 * @description Accessible Form Input component supporting standard text fields,
 * checkboxes, radio buttons, validation error messages, helper descriptions, and labels.
 */

import React from "react";
import { cn } from "../../utils/cn";

/**
 * Input Component
 *
 * @component
 * @param {Object} props - Input properties.
 * @param {string} [props.className] - Custom CSS/Tailwind classes.
 * @param {string} [props.type="text"] - HTML input type ("text", "password", "email", "checkbox", "radio", etc.).
 * @param {string} [props.label] - Input label displayed above the field.
 * @param {string} [props.description] - Sub-text explanation for user guidance.
 * @param {string} [props.error] - Validation error string displayed below field in red.
 * @param {boolean} [props.required=false] - Denotes field is required (renders asterisk).
 * @param {string} [props.id] - DOM ID (auto-generated if omitted).
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded DOM reference.
 * @returns {JSX.Element} Configured accessible input field.
 */
const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Base styling applied to text-like input fields
    const baseInputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Direct checkbox input element (when type is explicitly "checkbox")
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Direct radio button input element (when type is explicitly "radio")
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Standard text input wrapper with label, error, and helper description
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <input
                type={type}
                className={cn(
                    baseInputClasses,
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />

            {/* Helper description text */}
            {description && !error && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {/* Validation error message */}
            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
