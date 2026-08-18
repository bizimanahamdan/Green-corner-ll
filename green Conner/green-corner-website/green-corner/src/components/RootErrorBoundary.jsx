import { Component } from "react";

export default class RootErrorBoundary extends Component {
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
      <div style={{ minHeight: "100vh", background: "#0b0a08", color: "#efe7d6", padding: 24, fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>The admin page crashed</h1>
        <p style={{ color: "#f2960c", marginBottom: 16 }}>{this.state.error.message}</p>
        <button
          type="button"
          onClick={() => window.location.assign("/admin")}
          style={{ background: "#0fa02a", color: "#fff", border: 0, borderRadius: 999, padding: "12px 20px" }}
        >
          Reload admin
        </button>
      </div>
    );
  }
}
