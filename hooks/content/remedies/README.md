# Remedy Files

Each remedy is a YAML file: `slug-name.yaml`

The slug must match the filename. Add the slug to a condition's `remedySlugs`
frontmatter to make it available as `<RecipeCard slug="slug-name" />` in that article.

See `content/conditions/_TEMPLATE.mdx` for usage examples.

## Schema

```yaml
title: "Remedy Title"
description: "Optional one-line description."
ingredients:
  - item: "Ingredient name"
    amount: "1 cup"
    notes: "Optional clarification"
preparationSteps:
  - step: 1
    instruction: "Describe the step."
    tip: "Optional tip."
usageInstructions: "How to use once prepared."
videoId: "YOUTUBE_ID"      # optional
notes: "Any extra notes."  # optional
safetyNotes:               # optional
  - "Note one."
  - "Note two."
image: "/images/remedies/slug-name.jpg"   # optional, path under /public
imageAlt: "Description of the photo."     # optional, but recommended if image is set
```
