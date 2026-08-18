import { Component } from "react";

export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="admin-card p-6 max-w-xl">
        <h2 className="font-display text-xl font-semibold mb-2">This screen failed to load</h2>
        <p className="text-sm text-cream/60 mb-4">
          {this.state.error.message || "An unexpected error happened in the admin dashboard."}
        </p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            this.setState({ error: null });
            window.location.assign("/admin");
          }}
        >
          Reload admin
        </button>
      </div>
    );
  }
}
