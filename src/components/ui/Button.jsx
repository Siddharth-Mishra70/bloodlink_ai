/**
 * @file Button.jsx
 * @description Accessible, customizable Button component styled with Tailwind CSS,
 * class-variance-authority (CVA), and Radix UI Slot for polymorphic element support (`asChild`).
 * Supports icons, loading spinners, full-width layouts, and semantic variant styles.
 */

import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

/**
 * CVA configuration defining button visual variants and sizing dimensions.
 */
const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                success: "bg-success text-success-foreground hover:bg-success/90",
                warning: "bg-warning text-warning-foreground hover:bg-warning/90",
                danger: "bg-error text-error-foreground hover:bg-error/90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
                xs: "h-8 rounded-md px-2 text-xs",
                xl: "h-12 rounded-md px-10 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

/**
 * Button Component
 *
 * @component
 * @param {Object} props - Button properties.
 * @param {string} [props.className] - Optional custom CSS classes.
 * @param {'default'|'destructive'|'outline'|'secondary'|'ghost'|'link'|'success'|'warning'|'danger'} [props.variant='default'] - Visual style theme.
 * @param {'default'|'sm'|'lg'|'icon'|'xs'|'xl'} [props.size='default'] - Button size scale.
 * @param {boolean} [props.asChild=false] - Whether to merge props onto immediate child element via Radix Slot.
 * @param {React.ReactNode} [props.children] - Button label or nested JSX.
 * @param {boolean} [props.loading=false] - When true, disables button and renders spinning indicator.
 * @param {string} [props.iconName=null] - Optional Lucide icon name to render.
 * @param {'left'|'right'} [props.iconPosition='left'] - Position of icon relative to button label.
 * @param {number} [props.iconSize=null] - Overrides default icon size.
 * @param {boolean} [props.fullWidth=false] - Expands button width to 100% of parent container.
 * @param {boolean} [props.disabled=false] - Disables interaction and dims opacity.
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded DOM element ref.
 * @returns {JSX.Element} Rendered button or slotted element.
 */
const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...props
}, ref) => {
    // If asChild is true, delegate element rendering to Radix Slot
    const Comp = asChild ? Slot : "button";

    // Icon size mapping proportional to button size
    const iconSizeMap = {
        xs: 12,
        sm: 14,
        default: 16,
        lg: 18,
        xl: 20,
        icon: 16,
    };

    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 16;

    // Loading spinner SVG vector
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    // Safely renders the requested icon
    const renderIcon = () => {
        if (!iconName) return null;
        try {
            return (
                <Icon
                    name={iconName}
                    size={calculatedIconSize}
                    className={cn(
                        children && iconPosition === 'left' && "mr-2",
                        children && iconPosition === 'right' && "ml-2"
                    )}
                />
            );
        } catch {
            return null;
        }
    };

    // Standard button fallback in case asChild element resolution fails
    const renderFallbackButton = () => (
        <button
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </button>
    );

    // When asChild is enabled, inject icons and state into the passed child node
    if (asChild) {
        try {
            if (!children || React.Children?.count(children) !== 1) {
                return renderFallbackButton();
            }

            const child = React.Children?.only(children);

            if (!React.isValidElement(child)) {
                return renderFallbackButton();
            }
            const content = (
                <>
                    {loading && <LoadingSpinner />}
                    {iconName && iconPosition === 'left' && renderIcon()}
                    {child?.props?.children}
                    {iconName && iconPosition === 'right' && renderIcon()}
                </>
            );

            const clonedChild = React.cloneElement(child, {
                className: cn(
                    buttonVariants({ variant, size, className }),
                    fullWidth && "w-full",
                    child?.props?.className
                ),
                disabled: disabled || loading || child?.props?.disabled,
                children: content,
            });

            return <Comp ref={ref} {...props}>{clonedChild}</Comp>;
        } catch {
            return renderFallbackButton();
        }
    }

    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </Comp>
    );
});

Button.displayName = "Button";
export default Button;
