/**
 * @file ErrorBoundary.jsx
 * @description Global React class-based error boundary that catches unhandled JavaScript exceptions
 * in child component trees, logs them, and displays a user-friendly fallback screen with recovery actions.
 */

import React from "react";
import Icon from "./AppIcon";

/**
 * ErrorBoundary Class Component
 * Prevents full-application white-screen crashes by providing a fallback UI when a render error occurs.
 */
class ErrorBoundary extends React.Component {
  /**
   * Initializes error boundary state.
   * @param {Object} props - Component props containing children elements.
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Updates component state so next render shows fallback UI.
   * @param {Error} error - The caught runtime exception.
   * @returns {{ hasError: boolean }} Updated state flag.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Error lifecycle method invoked after an error has been thrown by a descendant.
   * Dispatches error payload to any global monitoring hooks if present.
   * @param {Error} error - The caught error instance.
   * @param {React.ErrorInfo} errorInfo - Component stack trace information.
   */
  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
  }

  render() {
    // If an uncaught error occurred, render user-friendly recovery interface
    if (this.state?.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center p-8 max-w-md">
            {/* Warning / Error Illustration SVG */}
            <div className="flex justify-center items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="42px" height="42px" viewBox="0 0 32 33" fill="none">
                <path d="M16 28.5C22.6274 28.5 28 23.1274 28 16.5C28 9.87258 22.6274 4.5 16 4.5C9.37258 4.5 4 9.87258 4 16.5C4 23.1274 9.37258 28.5 16 28.5Z" stroke="#343330" strokeWidth="2" strokeMiterlimit="10" />
                <path d="M11.5 15.5C12.3284 15.5 13 14.8284 13 14C13 13.1716 12.3284 12.5 11.5 12.5C10.6716 12.5 10 13.1716 10 14C10 14.8284 10.6716 15.5 11.5 15.5Z" fill="#343330" />
                <path d="M20.5 15.5C21.3284 15.5 22 14.8284 22 14C22 13.1716 21.3284 12.5 20.5 12.5C19.6716 12.5 19 13.1716 19 14C19 14.8284 19.6716 15.5 20.5 15.5Z" fill="#343330" />
                <path d="M21 22.5C19.9625 20.7062 18.2213 19.5 16 19.5C13.7787 19.5 12.0375 20.7062 11 22.5" stroke="#343330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Error Message Header & Description */}
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-medium text-neutral-800">Something went wrong</h1>
              <p className="text-neutral-600 text-base w w-8/12 mx-auto">We encountered an unexpected error while processing your request.</p>
            </div>

            {/* Reset / Home Navigation Button */}
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="ArrowLeft" size={18} color="#fff" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // When no error occurs, render normal child components
    return this.props?.children;
  }
}

export default ErrorBoundary;
