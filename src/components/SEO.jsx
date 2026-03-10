import { useEffect } from 'react';

export default function SEO({ title, description, keywords, schemaType = "Website" }) {
  useEffect(() => {
    // Update Title
    const baseTitle = "Printer Mixer";
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    document.title = fullTitle;

    // Update Description
    const metaDescription = document.querySelector('meta[name="description"]');
    const finalDesc = description || "Specializing in pro workstations, precision printing, and genuine Product accessories.";
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDesc);
    }

    // Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || "Premium Laptops, Business Printers, Expert Support");

    // Update Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    // Add Schema.org JSON-LD
    let script = document.getElementById('json-ld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": schemaType === "Product" ? "Product" : "Organization",
      "name": "Printer Mixer",
      "url": "https://printermixer.com",
      "logo": "https://printermixer.com/logo/logo.png",
      "description": finalDesc,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "N Rosemead Blvd",
        "addressLocality": "Pasadena",
        "addressRegion": "CA",
        "postalCode": "91107",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@printermixer.com"
      }
    };

    script.text = JSON.stringify(schemaData);

  }, [title, description, keywords, schemaType]);

  return null;
}


