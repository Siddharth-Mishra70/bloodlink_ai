/**
 * @file cn.js
 * @description Utility for conditionally joining class names and resolving Tailwind CSS conflicts.
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names using clsx and deduplicates Tailwind CSS utility classes using twMerge.
 *
 * @param {...(string|number|boolean|undefined|null|Object|Array)} inputs - Class names or conditional expressions.
 * @returns {string} Clean, merged CSS class string without duplicate or conflicting Tailwind rules.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
