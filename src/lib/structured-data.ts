import type {
  BreadcrumbList,
  ItemList,
  Organization,
  ProfilePage,
  WebSite,
  WithContext,
} from "schema-dts";
import { absoluteUrl } from "./utils";

/**
 * Organization Schema for Realsee
 * Provides company information to search engines
 */
export function getOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Realsee",
    url: "https://realsee.ai",
    logo: absoluteUrl("/realsee-logo.jpeg"),
    description:
      "Realsee provides professional 3D scanning, LiDAR technology, and immersive virtual tour solutions for real estate, architecture, and creative industries worldwide.",
    foundingDate: "2014",
    sameAs: [
      "https://twitter.com/REALSEE_Moment",
      "https://www.youtube.com/@realsee3d",
      "https://www.linkedin.com/company/realsee",
      "https://www.facebook.com/realsee3d",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
      email: "support@realsee.com",
    },
  };
}

/**
 * WebSite Schema with Search Action
 * Enables site search in search results
 */
export function getWebSiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Realsee Discover",
    url: absoluteUrl(),
    description:
      "Explore immersive 3D virtual tours, meet certified Realsee creators, and experience the future of real estate storytelling.",
    publisher: {
      "@type": "Organization",
      name: "Realsee",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/realsee-logo.jpeg"),
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      // @ts-expect-error - query-input is a valid schema.org property but not in schema-dts types
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * ProfilePage Schema for Professional/Creator pages
 * @param data Professional data
 */
export function getProfilePageSchema(data: {
  name: string;
  slug: string;
  shortBio?: string;
  location?: string;
  website?: string;
  portraitUrl: string;
  tourCount?: number;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
}): WithContext<ProfilePage> {
  const profileUrl = absoluteUrl(`/professional/${data.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${data.name} - Realsee Creator Profile`,
    url: profileUrl,
    mainEntity: {
      "@type": "Person",
      name: data.name,
      description:
        data.shortBio ||
        `Professional 3D photographer and Realsee creator specializing in immersive virtual tours.`,
      image: data.portraitUrl,
      jobTitle: "Professional 3D Photographer",
      worksFor: {
        "@type": "Organization",
        name: "Realsee",
      },
      ...(data.location && {
        address: {
          "@type": "PostalAddress",
          addressLocality: data.location,
        },
      }),
      ...(data.website && {
        url: data.website,
      }),
      ...(data.socialLinks && {
        sameAs: Object.values(data.socialLinks).filter(Boolean),
      }),
    },
    ...(data.tourCount && {
      about: `Portfolio featuring ${data.tourCount} immersive 3D virtual tours`,
    }),
  };
}

/**
 * BreadcrumbList Schema
 * Helps search engines understand site structure
 * @param items Breadcrumb items
 */
export function getBreadcrumbListSchema(
  items: Array<{ name: string; url: string }>,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * ItemList Schema for Tours
 * @param tours Array of tour items
 */
export function getToursItemListSchema(
  tours: Array<{
    id: string;
    title: string;
    url: string;
    cover?: string;
    category?: string;
  }>,
): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured 3D Virtual Tours",
    description:
      "Curated collection of immersive 3D virtual tours from Realsee creators",
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MediaObject",
        name: tour.title,
        url: tour.url,
        ...(tour.cover && {
          thumbnailUrl: tour.cover,
        }),
        ...(tour.category && {
          genre: tour.category,
        }),
        encodingFormat: "text/html",
      },
    })),
  };
}

/**
 * ItemList Schema for Professionals
 * @param professionals Array of professional items
 */
export function getProfessionalsItemListSchema(
  professionals: Array<{
    id: string | number;
    name: string;
    slug?: string;
    location?: string;
    portraitUrl: string;
  }>,
): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Certified Realsee Creators",
    description:
      "Professional 3D photographers and creators in the Realsee network",
    numberOfItems: professionals.length,
    itemListElement: professionals.map((pro, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: pro.name,
        url: absoluteUrl(`/professional/${pro.slug || pro.id}`),
        image: pro.portraitUrl,
        jobTitle: "Professional 3D Photographer",
        ...(pro.location && {
          address: {
            "@type": "PostalAddress",
            addressLocality: pro.location,
          },
        }),
      },
    })),
  };
}

/**
 * Get home page breadcrumbs
 */
export function getHomeBreadcrumbs(): WithContext<BreadcrumbList> {
  return getBreadcrumbListSchema([
    {
      name: "Home",
      url: absoluteUrl("/"),
    },
  ]);
}

/**
 * Get search page breadcrumbs
 */
export function getSearchBreadcrumbs(): WithContext<BreadcrumbList> {
  return getBreadcrumbListSchema([
    {
      name: "Home",
      url: absoluteUrl("/"),
    },
    {
      name: "Search",
      url: absoluteUrl("/search"),
    },
  ]);
}

/**
 * Get professional detail page breadcrumbs
 * @param professionalName Professional's name
 * @param professionalSlug Professional's slug
 */
export function getProfessionalBreadcrumbs(
  professionalName: string,
  professionalSlug: string,
): WithContext<BreadcrumbList> {
  return getBreadcrumbListSchema([
    {
      name: "Home",
      url: absoluteUrl("/"),
    },
    {
      name: "Professionals",
      url: absoluteUrl("/search"),
    },
    {
      name: professionalName,
      url: absoluteUrl(`/professional/${professionalSlug}`),
    },
  ]);
}
