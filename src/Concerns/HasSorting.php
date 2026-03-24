<?php

namespace Forjed\InertiaTable\Concerns;

trait HasSorting
{
    protected function applySorting(array $columns): void
    {
        $sortParam = request()->input($this->getSortParam());

        // Parse single sort param: "name" = asc, "-name" = desc
        $sortBy = null;
        $sortDir = 'asc';

        if ($sortParam) {
            if (str_starts_with($sortParam, '-')) {
                $sortBy = substr($sortParam, 1);
                $sortDir = 'desc';
            } else {
                $sortBy = $sortParam;
                $sortDir = 'asc';
            }
        }

        // 1. User sort (highest priority)
        if ($sortBy) {
            $sortableColumns = collect($columns)->filter->isSortable();
            $matchedColumn = $sortableColumns->first(
                fn ($col) => $col->getSortKey() === $sortBy
            );

            if ($matchedColumn) {
                $this->query->reorder();
                $this->query->orderBy($matchedColumn->getAccessor(), $sortDir);

                return;
            }
        }

        // 2. Pre-existing query orders (medium priority)
        $baseQuery = method_exists($this->query, 'getQuery')
            ? $this->query->getQuery()
            : $this->query;

        if (! empty($baseQuery->orders)) {
            return;
        }

        // 3. Default sort (lowest priority)
        if (str_starts_with($this->defaultSort, '-')) {
            $this->query->orderBy(substr($this->defaultSort, 1), 'desc');
        } else {
            $this->query->orderBy($this->defaultSort, 'asc');
        }
    }
}
