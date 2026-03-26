<h1 align="center">Inertia Table</h1>
<p align="center">
  Backend-driven dynamic tables for Laravel + Inertia.js. Define your entire table in PHP - columns, sorting, searching, pagination, and display formatting - and the frontend renders it automatically. No duplicated definitions, no frontend table logic, no state management.
</p>
<p align="center">
  <a href="https://github.com/forjedio/inertia-table/actions/workflows/tests.yml"><img src="https://github.com/forjedio/inertia-table/actions/workflows/tests.yml/badge.svg?branch=main" alt="Tests"></a>
  <a href="https://github.com/forjedio/inertia-table/actions/workflows/tests.yml"><img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/RichardAnderson/e29bf5a426b54efb85898a4f5eb4bd49/raw/inertia-table-php-coverage.json" alt="PHP Coverage"></a>
  <a href="https://github.com/forjedio/inertia-table/actions/workflows/tests.yml"><img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/RichardAnderson/e29bf5a426b54efb85898a4f5eb4bd49/raw/inertia-table-vue-coverage.json" alt="Vue Coverage"></a>
  <a href="https://github.com/forjedio/inertia-table/actions/workflows/tests.yml"><img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/RichardAnderson/e29bf5a426b54efb85898a4f5eb4bd49/raw/inertia-table-react-coverage.json" alt="React Coverage"></a>
  <a href="https://inertia-table.forjed.io/"><img src="https://img.shields.io/badge/docs-inertia--table.forjed.io-blue" alt="Documentation"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>
<p align="center">
  <img src="https://inertia-table.forjed.io/images/demo-light.png" alt="Inertia Table">
</p>

## Quick Example

```php
class CompanyTable extends Table
{
    protected string $defaultSort = '-created_at';

    protected function columns(): array
    {
        return [
            LinkColumn::make('name', 'Name')
                ->route('companies.show', ['company' => ':id'])
                ->sortable(),
            TextColumn::make('email', 'Email')->sortable(),
            EnumColumn::make('status', 'Status')->sortable(),
            BooleanColumn::make('active', 'Active'),
            DateTimeColumn::make('created_at', 'Created')->sortable(),
            ActionsColumn::make(),
            Column::data('id'),
        ];
    }

    protected function searchable(): array
    {
        return ['name', 'email'];
    }
}
```

Pass it to your Inertia page:

```php
return Inertia::render('Companies/Index', [
    'companies' => CompanyTable::make(Company::query())->paginate(),
]);
```

Render it on the frontend:

```tsx
import { InertiaTable } from 'inertia-table-react';

export default function Index({ companies }) {
    return <InertiaTable tableData={companies} />;
}
```

That's it. Search, sorting, pagination, and all cell rendering handled automatically.

## Features

- **11 column types** - Text, Badge, Boolean, Date, DateTime, Link, Copyable, Enum, Component, Actions, and hidden data columns
- **Icon modifiers** - `withIcon()` and `asIcon()` on any column with map, closure, or fixed icon support
- **Sorting** - single-column with URL state, three-tier priority, `-` prefix for descending
- **Searching** - global full-text search with configurable debounce
- **Pagination** - full and simple modes with configurable per-page
- **Enum integration** - PHP enums automatically render as coloured badges
- **Table hooks** - `beforeQuery` and `afterData` hooks for query modification and data transformation
- **Frontend hooks** - extension system for realtime updates, analytics, and feature flags
- **Link routing** - Ziggy or server-side URL resolution (configurable)
- **Multiple tables** - identifier system for independent tables on the same page
- **Component columns** - register reusable frontend components for custom cell rendering
- **Dark mode** - all styles include `dark:` variants out of the box
- **Fully customisable** - override any cell, header, search, pagination, or toolbar via render props. Compatible with shadcn/ui.

## Installation

```bash
composer require forjedio/inertia-table
```

```bash
# React
npm install vendor/forjedio/inertia-table/react

# Vue
npm install vendor/forjedio/inertia-table/vue
```

## Requirements

- PHP 8.2+
- Laravel 12 or 13
- Inertia.js 2.0+
- React 18/19 or Vue 3.4+
- Tailwind CSS 3.4+ or 4.0+

## Documentation

Full documentation is available at **[inertia-table.forjed.io](https://inertia-table.forjed.io/)**.

## Live Demo

See it in action at **[inertia-table-demo.forjed.io](https://inertia-table-demo.forjed.io/)**.

## License

MIT
