# Image SEO Guidelines for Realsee Discover

## Overview
This document provides guidelines for optimizing images for SEO and performance across the Realsee Discover platform.

## Current Image Optimization Status

### ✅ Already Optimized
- **Professional portraits** (`/professional/[id].jpg`):
  - Uses Next.js Image component with priority for above-the-fold content
  - Has descriptive alt text with name, role, and location
  - Implements responsive sizes
  - Has blur placeholder for better UX

### 🔍 Components to Review

#### 1. TourGrid Component (`src/components/custom/home/TourGrid.tsx`)
**Current Status**: Uses Next.js Image component
**Recommendations**:
- ✅ Already uses `loading="lazy"` for non-critical images
- ✅ Has blur placeholders
- 🔧 **Action needed**: Enhance alt text to include tour type/category
  - Bad: `alt={vr.title}`
  - Good: `alt={vr.title + " - Immersive 3D Virtual Tour" + (vr.category ? ` - ${vr.category}` : "")}`

#### 2. Professionals Component (`src/components/custom/home/Professionals.tsx`)
**Current Status**: Uses Next.js Image component in carousel
**Recommendations**:
- ✅ Uses lazy loading
- 🔧 **Action needed**: Add descriptive alt text
  - Format: `{name} - Professional 3D Photographer from {location}`

#### 3. Carousel Component (`src/components/custom/home/Carousel.tsx`)
**Current Status**: Hero/featured tour images
**Recommendations**:
- ✅ Should use `priority` for first slide only
- ✅ Subsequent slides should use `loading="lazy"`
- 🔧 **Action needed**: Implement conditional priority loading

#### 4. ToursGrid Component (`professional/[slug]/ToursGrid.tsx`)
**Recommendations**:
- ✅ Non-critical, should use `loading="lazy"`
- 🔧 **Action needed**: Add descriptive alt text with tour title and category

## General Image SEO Best Practices

### Alt Text Guidelines
1. **Be descriptive** - Describe what's in the image and its context
2. **Include keywords naturally** - Use relevant terms like "3D virtual tour", "immersive", etc.
3. **Add location** - When applicable (e.g., "from New York")
4. **Keep it concise** - 125 characters or less is ideal
5. **Don't stuff keywords** - Write for humans first

### Loading Strategy
- **Above the fold**: Use `priority` attribute
- **Below the fold**: Use `loading="lazy"` (default)
- **Critical content**: Load immediately
- **Decorative images**: Can be lazy-loaded

### Responsive Images
Always use the `sizes` attribute for proper responsive loading:
```tsx
sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
```

### Blur Placeholders
- Use for all significant images
- Improves perceived performance
- Better UX during loading

## Implementation Checklist

### High Priority
- [x] Professional portrait images - ✅ Optimized
- [ ] Tour cover images in TourGrid
- [ ] Professional portraits in Professionals carousel
- [ ] Hero carousel images

### Medium Priority
- [ ] Tour images in search results
- [ ] Tour images in professional detail pages
- [ ] Background images (if any)

### Low Priority
- [ ] Icon images (if using img tags instead of SVG)
- [ ] Decorative images

## Example Implementations

### Good Example - Professional Portrait
```tsx
<Image
  src={`/professional/${pro.id}.jpg`}
  alt={`${pro.name} - Professional 3D Photographer and Realsee Creator from ${pro.Location}`}
  width={960}
  height={1280}
  sizes="(min-width: 1920px) 520px, (min-width: 1536px) 480px, (min-width: 1280px) 440px, (min-width: 1024px) 380px, (min-width: 640px) 60vw, 85vw"
  placeholder="blur"
  blurDataURL="data:image/svg+xml,%3Csvg..."
  priority
/>
```

### Good Example - Tour Cover Image
```tsx
<Image
  src={tour.cover}
  alt={`${tour.title} - Immersive 3D Virtual Tour${tour.category ? ` - ${tour.category}` : ""}`}
  width={800}
  height={450}
  sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
  loading="lazy"
  placeholder="blur"
  blurDataURL={getBlurPlaceholder(tour.cover)}
/>
```

### Good Example - Hero/Carousel Image
```tsx
<Image
  src={image.src}
  alt={`${image.title} - Featured 3D Virtual Tour Showcase`}
  fill
  priority={index === 0} // Only first slide gets priority
  sizes="100vw"
  className="object-cover"
/>
```

## Tools for Testing

1. **Google Lighthouse** - Check image optimization scores
2. **Web.dev Measure** - Performance metrics
3. **Chrome DevTools** - Network tab to check loading behavior
4. **Screaming Frog** - Bulk audit of all image alt texts

## Accessibility Notes

- Alt text is crucial for screen readers
- Decorative images should have empty alt (`alt=""`)
- Functional images (buttons, links) should describe the action
- Informative images should describe the content

## Performance Metrics Goals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **Image size**: Serve appropriate sizes, not oversized
- **Format**: Use modern formats (AVIF, WebP) via Next.js Image
- **Compression**: Balance quality vs file size (quality: 75-85)

## Next Steps

1. Audit all Image components in the codebase
2. Update alt texts following the guidelines
3. Ensure proper loading strategies
4. Add blur placeholders where missing
5. Test with Lighthouse and fix any issues
6. Document any custom image patterns

---

Last updated: 2025-01-01
Maintained by: Realsee Discover Team

