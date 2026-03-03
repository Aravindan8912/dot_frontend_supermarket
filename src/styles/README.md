# Global styles (partials)

Styles are split so each file has a clear responsibility. Load order is defined in `src/styles.css` via `@import`.

| File | Purpose |
|------|--------|
| `variables.css` | Design tokens (colors, spacing, shadows) – FFC300, 000814, white |
| `base.css` | Global font, body |
| `login.css` | Login page & auth form |
| `toast.css` | Toast / notification component |
| `layout.css` | Dashboard layout, sidebar, header |
| `components.css` | Promo, category cards, food cards, analytics, add-category form |
| `order-summary.css` | Order summary (cart) panel |
| `responsive.css` | Breakpoints for layout and pages |
| `orders.css` | Orders list, table, dialog form, status badges |
| `settings.css` | Settings page |

Edit the partials here; `src/styles.css` only imports them. No change to `angular.json` is required.
