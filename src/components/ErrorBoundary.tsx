import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              padding: "2rem",
              color: "var(--fg)",
              background: "var(--bg)",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              fontFamily: "var(--font-body, sans-serif)",
            }}
          >
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
            <p style={{ color: "var(--fg-muted)", maxWidth: "40ch", textAlign: "center" }}>
              {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.5rem 1.5rem",
                background: "var(--primary)",
                color: "var(--primary-fg)",
                border: "none",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
