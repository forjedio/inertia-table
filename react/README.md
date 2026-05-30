# @forjedio/inertia-table-react

React components for [Forjed Inertia Table](https://inertia-table.forjed.io/) — backend-driven dynamic tables for Laravel + Inertia.js.

See the [documentation](https://inertia-table.forjed.io/) for full installation and usage.

## Tailwind CSS content sources

The package ships pre-built JS in `dist/`. Tailwind needs to scan it so the table's utility classes are emitted into your CSS bundle.

### Tailwind v4 (CSS-first config)

In the CSS file where you import Tailwind, add an `@source` directive pointing at the package:

```css
@import "tailwindcss";
@source "../../node_modules/@forjedio/inertia-table-react";
```

Adjust the relative path so it resolves to your project's `node_modules/` from wherever the CSS file lives.

### Tailwind v3 (`tailwind.config.js`)

Add the package's `dist` directory to the `content` array:

```js
export default {
    content: [
        './resources/**/*.{js,jsx,ts,tsx}',
        './node_modules/@forjedio/inertia-table-react/dist/**/*.{js,cjs}',
    ],
    // ...
}
```
