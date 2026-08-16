import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "../lib/siteConfig";

/**
 * Drop this once near the top of every page component to give it its own
 * title, meta description, canonical URL and social preview — instead of
 * every route sharing the one static <title>/<meta> in index.html.
 *
 * <SEO title="Menu" description="..." path="/menu" />
 */
export default function SEO({ title, description, path = "/", image, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
