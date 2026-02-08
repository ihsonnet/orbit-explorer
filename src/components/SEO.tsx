import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: object | object[];
  noIndex?: boolean;
}

const BASE_URL = 'https://spaceforeveryone.com';
const DEFAULT_IMAGE = 'https://spaceforeveryone.com/og-image.png';
const SITE_NAME = 'S.P.A.C.E. for Everyone';
const DEFAULT_DESCRIPTION = 'Track 9,000+ satellites powering your GPS, internet & weather. Explore real-time space data. Space isn\'t just for scientists—it\'s for everyone.';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'satellites, space, NASA, SpaceX, GPS, earth observation, weather satellites, space education, satellite tracking, LEO, MEO, GEO, orbital mechanics',
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  author = 'S.P.A.C.E. for Everyone',
  publishedTime,
  modifiedTime,
  jsonLd,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | S.P.A.C.E. for Everyone`
    : `${SITE_NAME} - Explore The Space We Already Live In`;

  const canonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : BASE_URL);

  // Default Organization JSON-LD
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: DEFAULT_IMAGE,
    description: 'Making space accessible to all. Interactive satellite tracking and space education platform.',
    sameAs: [],
  };

  // Default WebSite JSON-LD with SearchAction for AIO
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/learn?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Combine all JSON-LD
  const allJsonLd = [
    organizationJsonLd,
    websiteJsonLd,
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
  ];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific (for blog posts) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {ogType === 'article' && <meta property="article:author" content={author} />}

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* AI/LLM Optimization Tags */}
      <meta name="ai-content-declaration" content="human-created" />
      <meta name="generator" content="Lovable" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(allJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
