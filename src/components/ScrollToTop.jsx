/**
 * @file ScrollToTop.jsx
 * @description Route change listener that automatically scrolls the browser window to top (0, 0).
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Listens for react-router pathname changes and triggers window.scrollTo(0, 0).
 * Rendered at the top of the route tree; does not render any DOM elements.
 *
 * @component
 * @returns {null} Renders no visual markup.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset window scroll coordinate upon route navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
