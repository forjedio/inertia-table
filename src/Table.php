<?php

namespace Forjed\InertiaTable;

use Closure;
use Forjed\InertiaTable\Concerns\HasPagination;
use Forjed\InertiaTable\Concerns\HasSearch;
use Forjed\InertiaTable\Concerns\HasSorting;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Collection;

abstract class Table
{
    use HasPagination, HasSearch, HasSorting;

    protected EloquentBuilder|QueryBuilder|Relation $query;

    protected string $defaultSort = '-created_at';

    protected int $perPage;

    protected ?string $identifier = null;

    protected array $tableSettings = [];

    public function __construct(EloquentBuilder|QueryBuilder|Relation $query)
    {
        $this->query = $query;
        $this->perPage ??= config('inertia-table.per_page', 10);
    }

    public static function make(EloquentBuilder|QueryBuilder|Relation $query): static
    {
        return new static($query);
    }

    abstract protected function columns(): array;

    /**
     * Apply default query modifications (eager loading, scopes, etc.).
     * Called at the start of every query before hooks, search, and sorting.
     */
    protected function query(): void
    {
        //
    }

    protected function searchable(): array
    {
        return [];
    }

    // --- Hook registration (delegates to HookRegistry) ---

    /**
     * Register a hook that runs before query execution.
     * The callback receives the query builder and columns array (by reference).
     */
    public static function beforeQuery(string $tableClass, Closure $callback): void
    {
        app(HookRegistry::class)->beforeQuery($tableClass, $callback);
    }

    /**
     * Register a hook that runs after data mapping.
     * The callback receives the mapped row Collection.
     * Return a modified Collection, or null to keep the original.
     */
    public static function afterData(string $tableClass, Closure $callback): void
    {
        app(HookRegistry::class)->afterData($tableClass, $callback);
    }

    /**
     * Register a hook that runs before query execution on ALL tables.
     * The callback receives the query builder and columns array (by reference).
     * The table class is passed as an optional trailing parameter.
     */
    public static function globalBeforeQuery(Closure $callback): void
    {
        app(HookRegistry::class)->globalBeforeQuery($callback);
    }

    /**
     * Register a hook that runs after data mapping on ALL tables.
     * The callback receives the mapped row Collection.
     * Return a modified Collection, or null to keep the original.
     * The table class is passed as an optional trailing parameter.
     */
    public static function globalAfterData(Closure $callback): void
    {
        app(HookRegistry::class)->globalAfterData($callback);
    }

    /**
     * Remove all hooks. Optionally scoped to a specific table class.
     */
    public static function clearHooks(?string $tableClass = null): void
    {
        app(HookRegistry::class)->clearHooks($tableClass);
    }

    /**
     * Remove only global hooks (preserves class-specific hooks).
     */
    public static function clearGlobalHooks(): void
    {
        app(HookRegistry::class)->clearGlobalHooks();
    }

    // --- URL parameter names (scoped by identifier) ---

    public function getSearchParam(): string
    {
        return $this->identifier ? "{$this->identifier}Search" : 'search';
    }

    public function getSortParam(): string
    {
        return $this->identifier ? "{$this->identifier}Sort" : 'sort';
    }

    public function getPageParam(): string
    {
        return $this->identifier ? "{$this->identifier}Page" : 'page';
    }

    // --- Output methods ---

    public function simplePaginate(): array
    {
        $this->paginationMethod = 'simple';

        return $this->buildResponse();
    }

    public function paginate(): array
    {
        $this->paginationMethod = 'full';

        return $this->buildResponse();
    }

    public function toArray(?int $take = null, ?int $skip = null): array
    {
        return $this->toCollection($take, $skip)->all();
    }

    public function toCollection(?int $take = null, ?int $skip = null): Collection
    {
        $columns = $this->prepareQuery();

        if ($skip !== null) {
            $this->query->skip($skip);
        }

        if ($take !== null) {
            $this->query->take($take);
        }

        $data = $this->query->get()
            ->map(fn ($model) => $this->rowFromModel($model, $columns));

        return $this->runAfterDataHooks($data);
    }

    protected function buildResponse(): array
    {
        $columns = $this->prepareQuery();

        $paginated = $this->paginateQuery();

        $items = method_exists($paginated, 'getCollection')
            ? $paginated->getCollection()
            : collect($paginated->items());

        $data = $items
            ->map(fn ($model) => $this->rowFromModel($model, $columns));

        $data = $this->runAfterDataHooks($data);

        return [
            'columns' => array_map(fn (Column $col) => $col->toArray(), $columns),
            'data' => $data->all(),
            'links' => $this->buildLinks($paginated),
            'meta' => $this->buildMeta($paginated),
            'searchable' => count($this->searchable()) > 0,
            'searchDebounce' => config('inertia-table.search_debounce', 300),
            'dateFormat' => config('inertia-table.date_format', 'YYYY-MM-DD HH:mm:ss'),
            'identifier' => $this->identifier,
            'tableSettings' => $this->tableSettings,
        ];
    }

    /**
     * Shared query preparation: resolve columns, run beforeQuery hooks,
     * apply search and sorting. Returns the processed columns array.
     */
    protected function prepareQuery(): array
    {
        $this->query();

        $columns = $this->columns();

        app(HookRegistry::class)->runBeforeQueryHooks(static::class, $this->query, $columns);

        $this->applySearch();
        $this->applySorting($columns);

        return $columns;
    }

    protected function rowFromModel(mixed $model, array $columns): array
    {
        $row = [];

        foreach ($columns as $column) {
            $row[$column->getName()] = $column->getValue($model);

            foreach ($column->resolveDisplayValues($model) as $key => $value) {
                $row[$key] = $value;
            }
        }

        return $row;
    }

    /**
     * Run afterData hooks via the registry.
     */
    protected function runAfterDataHooks(Collection $data): Collection
    {
        return app(HookRegistry::class)->runAfterDataHooks(static::class, $data);
    }

    // --- Fluent setters ---

    public function perPage(int $perPage): static
    {
        $this->perPage = $perPage;

        return $this;
    }

    public function identifier(string $identifier): static
    {
        $this->identifier = $identifier;

        return $this;
    }

    public function withSettings(array $settings): static
    {
        $this->tableSettings = array_merge($this->tableSettings, $settings);

        return $this;
    }
}
