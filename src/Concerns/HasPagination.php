<?php

namespace Forjed\InertiaTable\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;

trait HasPagination
{
    protected string $paginationMethod = 'simple';

    protected function paginateQuery(): Paginator|LengthAwarePaginator
    {
        $method = $this->paginationMethod;

        $pageParam = $this->getPageParam();

        $paginator = $method === 'full'
            ? $this->query->paginate($this->perPage, ['*'], $pageParam)
            : $this->query->simplePaginate($this->perPage, ['*'], $pageParam);

        $paginator->appends(request()->query());

        return $paginator;
    }

    protected function buildLinks(Paginator|LengthAwarePaginator $paginated): array
    {
        $links = [
            'first' => null,
            'last' => null,
            'prev' => $paginated->previousPageUrl(),
            'next' => $paginated->nextPageUrl(),
        ];

        if ($paginated instanceof LengthAwarePaginator) {
            $links['first'] = $paginated->url(1);
            $links['last'] = $paginated->url($paginated->lastPage());
        }

        return $links;
    }

    protected function buildMeta(Paginator|LengthAwarePaginator $paginated): array
    {
        $meta = [
            'current_page' => $paginated->currentPage(),
            'current_page_url' => $paginated->url($paginated->currentPage()),
            'from' => $paginated->firstItem(),
            'path' => $paginated->path(),
            'per_page' => $paginated->perPage(),
            'to' => $paginated->lastItem(),
        ];

        if ($paginated instanceof LengthAwarePaginator) {
            $meta['total'] = $paginated->total();
            $meta['last_page'] = $paginated->lastPage();
        }

        return $meta;
    }
}
