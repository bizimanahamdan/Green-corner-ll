import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <section className="container-narrow pt-32 pb-24 text-center">
      <SEO title="Page Not Found" path="/404" noindex />
      <p className="eyebrow mb-3">404</p>
      <h1 className="section-heading mb-4">This table isn't set.</h1>
      <p className="text-mute mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </section>
  );
}
