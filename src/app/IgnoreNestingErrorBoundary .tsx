import React from "react";

interface IgnoreNestingErrorBoundaryProps {
  children: React.ReactNode;
}

class IgnoreNestingErrorBoundary extends React.Component<IgnoreNestingErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    if (error.message.includes("<button> cannot be a descendant of <button>")) {
      return { hasError: true };
    }
    return null;
  }

  render() {
    if (this.state.hasError) return null; // Ignore error
    return this.props.children;
  }
}

export default IgnoreNestingErrorBoundary;
