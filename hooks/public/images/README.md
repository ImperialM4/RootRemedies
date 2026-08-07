# Cover Images

Place condition cover images in this folder using the naming convention:

  `conditions/{slug}.jpg`

For example, for `content/conditions/sore-throat.mdx`:

  `public/images/conditions/sore-throat.jpg`

Then reference it in your frontmatter:

```yaml
coverImage: "/images/conditions/sore-throat.jpg"
coverImageAlt: "Description of the image"
```

## Recommended image specs

- **Dimensions:** 1200 × 630px (matches OG image aspect ratio)
- **Format:** JPEG or WebP
- **File size:** Under 200KB (Next.js Image will optimize further)

If you don't have a cover image, omit `coverImage` from the frontmatter.
The card will display a neutral placeholder instead.
