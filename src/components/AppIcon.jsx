/**
 * @file AppIcon.jsx
 * @description Dynamic Lucide Icon wrapper component that safely resolves and renders
 * icons by string name, providing a fallback icon when an invalid name is supplied.
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

/**
 * AppIcon Component
 * Resolves a Lucide icon by string name dynamically.
 *
 * @component
 * @param {Object} props - Icon component props.
 * @param {string} props.name - The Lucide icon identifier (e.g. "Droplet", "Activity", "Heart").
 * @param {number|string} [props.size=24] - Rendered icon width & height in pixels.
 * @param {string} [props.color="currentColor"] - Stroke or fill color.
 * @param {string} [props.className=""] - Additional Tailwind or CSS classes.
 * @param {number} [props.strokeWidth=2] - Stroke width of the SVG vector.
 * @returns {JSX.Element} The rendered Lucide SVG icon, or HelpCircle fallback if not found.
 */
function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}) {
  // Dynamically look up requested icon in lucide-react exports
  const IconComponent = LucideIcons?.[name];

  // If icon name is invalid or not found, render HelpCircle fallback
  if (!IconComponent) {
    return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}

export default Icon;
