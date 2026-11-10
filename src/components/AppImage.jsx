/**
 * @file AppImage.jsx
 * @description Safe Image wrapper component with automatic fallback image replacement on error.
 */

import React from 'react';

/**
 * Image Component
 * Renders an HTML <img> element equipped with an `onError` handler
 * that seamlessly replaces broken image URLs with a default placeholder image.
 *
 * @component
 * @param {Object} props - Image component props.
 * @param {string} props.src - Target image resource URL.
 * @param {string} [props.alt="Image Name"] - Accessible alternative text.
 * @param {string} [props.className=""] - CSS / Tailwind styling classes.
 * @returns {JSX.Element} Configured <img> element with fallback recovery.
 */
function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      // When image loading fails (e.g. 404), replace with fallback placeholder asset
      onError={(e) => {
        e.target.src = "/assets/images/no_image.png";
      }}
      {...props}
    />
  );
}

export default Image;
