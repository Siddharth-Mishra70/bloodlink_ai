/**
 * @file Checkbox.jsx
 * @description Accessible Checkbox and CheckboxGroup components supporting tri-state
 * (checked, unchecked, indeterminate), error messages, labels, and helper descriptions.
 */

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Checkbox Component
 *
 * @component
 * @param {Object} props - Checkbox props.
 * @param {string} [props.className] - Container CSS classes.
 * @param {string} [props.id] - Element ID (auto-generated if omitted).
 * @param {boolean} props.checked - Controlled check state.
 * @param {boolean} [props.indeterminate=false] - Tri-state partial selection indicator.
 * @param {boolean} [props.disabled=false] - Disables toggling.
 * @param {boolean} [props.required=false] - Denotes mandatory form field.
 * @param {React.ReactNode} [props.label] - Label text displayed alongside checkbox.
 * @param {string} [props.description] - Sub-text providing field context.
 * @param {string} [props.error] - Validation error message.
 * @param {'sm'|'default'|'lg'} [props.size='default'] - Size variation.
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded input ref.
 * @returns {JSX.Element} Rendered accessible checkbox element.
 */
const Checkbox = React.forwardRef(({
    className,
    id,
    checked,
    indeterminate = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    size = "default",
    ...props
}, ref) => {
    // Generate unique ID if not explicitly provided
    const checkboxId = id || `checkbox-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Dimensions according to selected size
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-4 w-4",
        lg: "h-5 w-5"
    };

    return (
        <div className={cn("flex items-start space-x-2", className)}>
            <div className="relative flex items-center">
                {/* Screen-reader accessible hidden native checkbox */}
                <input
                    type="checkbox"
                    ref={ref}
                    id={checkboxId}
                    checked={checked}
                    disabled={disabled}
                    required={required}
                    className="sr-only"
                    {...props}
                />

                {/* Custom styled visual checkbox square */}
                <label
                    htmlFor={checkboxId}
                    className={cn(
                        "peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer transition-colors",
                        sizeClasses?.[size],
                        checked && "bg-primary text-primary-foreground border-primary",
                        indeterminate && "bg-primary text-primary-foreground border-primary",
                        error && "border-destructive",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    {/* Render Check icon when checked */}
                    {checked && !indeterminate && (
                        <Check className="h-3 w-3 text-current flex items-center justify-center" />
                    )}
                    {/* Render Minus icon when indeterminate */}
                    {indeterminate && (
                        <Minus className="h-3 w-3 text-current flex items-center justify-center" />
                    )}
                </label>
            </div>

            {/* Optional label, contextual description, and validation error */}
            {(label || description || error) && (
                <div className="flex-1 space-y-1">
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                error ? "text-destructive" : "text-foreground"
                            )}
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </label>
                    )}

                    {description && !error && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

Checkbox.displayName = "Checkbox";

/**
 * CheckboxGroup Component
 * Wraps a collection of checkboxes inside an accessible <fieldset> with legend.
 *
 * @component
 * @param {Object} props - CheckboxGroup props.
 * @param {string} [props.className] - Fieldset styling.
 * @param {React.ReactNode} props.children - Checkbox items.
 * @param {string} [props.label] - Fieldset legend header.
 * @param {string} [props.description] - Group instructions.
 * @param {string} [props.error] - Group-level error message.
 * @param {boolean} [props.required=false] - Requires at least one selection.
 * @param {boolean} [props.disabled=false] - Disables all group inputs.
 * @param {React.Ref<HTMLFieldSetElement>} ref - Forwarded fieldset ref.
 * @returns {JSX.Element} Fieldset wrapping multiple checkboxes.
 */
const CheckboxGroup = React.forwardRef(({
    className,
    children,
    label,
    description,
    error,
    required = false,
    disabled = false,
    ...props
}, ref) => {
    return (
        <fieldset
            ref={ref}
            disabled={disabled}
            className={cn("space-y-3", className)}
            {...props}
        >
            {label && (
                <legend className={cn(
                    "text-sm font-medium",
                    error ? "text-destructive" : "text-foreground"
                )}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </legend>
            )}

            {description && !error && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            <div className="space-y-2">
                {children}
            </div>

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </fieldset>
    );
});

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
