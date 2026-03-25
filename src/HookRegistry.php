<?php

namespace Forjed\InertiaTable;

use Closure;
use Illuminate\Support\Collection;

class HookRegistry
{
    /** @var array<class-string, list<Closure>> */
    protected array $beforeQueryHooks = [];

    /** @var array<class-string, list<Closure>> */
    protected array $afterDataHooks = [];

    /** @var list<Closure> */
    protected array $globalBeforeQueryHooks = [];

    /** @var list<Closure> */
    protected array $globalAfterDataHooks = [];

    /**
     * Register a hook that runs before query execution.
     * The callback receives the query builder and columns array (by reference).
     */
    public function beforeQuery(string $tableClass, Closure $callback): void
    {
        $this->beforeQueryHooks[$tableClass][] = $callback;
    }

    /**
     * Register a hook that runs after data mapping.
     * The callback receives the mapped row Collection.
     * Return a modified Collection, or null to keep the original.
     */
    public function afterData(string $tableClass, Closure $callback): void
    {
        $this->afterDataHooks[$tableClass][] = $callback;
    }

    /**
     * Register a hook that runs before query execution on ALL tables.
     * The callback receives the query builder, columns array (by reference),
     * and optionally the table class as a trailing parameter.
     */
    public function globalBeforeQuery(Closure $callback): void
    {
        $this->globalBeforeQueryHooks[] = $callback;
    }

    /**
     * Register a hook that runs after data mapping on ALL tables.
     * The callback receives the mapped row Collection and optionally
     * the table class as a trailing parameter.
     * Return a modified Collection, or null to keep the original.
     */
    public function globalAfterData(Closure $callback): void
    {
        $this->globalAfterDataHooks[] = $callback;
    }

    /**
     * Remove all hooks. Optionally scoped to a specific table class.
     */
    public function clearHooks(?string $tableClass = null): void
    {
        if ($tableClass) {
            unset($this->beforeQueryHooks[$tableClass]);
            unset($this->afterDataHooks[$tableClass]);
        } else {
            $this->beforeQueryHooks = [];
            $this->afterDataHooks = [];
            $this->globalBeforeQueryHooks = [];
            $this->globalAfterDataHooks = [];
        }
    }

    /**
     * Remove only global hooks (preserves class-specific hooks).
     */
    public function clearGlobalHooks(): void
    {
        $this->globalBeforeQueryHooks = [];
        $this->globalAfterDataHooks = [];
    }

    /**
     * Run all beforeQuery hooks for the given table class.
     * Global hooks run first, then class-specific hooks (with hierarchy).
     */
    public function runBeforeQueryHooks(string $tableClass, mixed $query, array &$columns): void
    {
        foreach ($this->globalBeforeQueryHooks as $hook) {
            $hook($query, $columns, $tableClass);
        }

        foreach ($this->resolveHooks($this->beforeQueryHooks, $tableClass) as $hook) {
            $hook($query, $columns);
        }
    }

    /**
     * Run all afterData hooks for the given table class.
     * Global hooks run first, then class-specific hooks (with hierarchy).
     */
    public function runAfterDataHooks(string $tableClass, Collection $data): Collection
    {
        foreach ($this->globalAfterDataHooks as $hook) {
            $data = $hook($data, $tableClass) ?? $data;
        }

        foreach ($this->resolveHooks($this->afterDataHooks, $tableClass) as $hook) {
            $data = $hook($data) ?? $data;
        }

        return $data;
    }

    /**
     * Collect hooks for the given class and all its ancestors (up to Table).
     */
    protected function resolveHooks(array $registry, string $tableClass): array
    {
        $hooks = [];

        // Hooks on the exact class
        if (isset($registry[$tableClass])) {
            $hooks = array_merge($hooks, $registry[$tableClass]);
        }

        // Walk parent classes (stop before Table itself)
        foreach (class_parents($tableClass) as $parent) {
            if ($parent === Table::class) {
                break;
            }

            if (isset($registry[$parent])) {
                $hooks = array_merge($hooks, $registry[$parent]);
            }
        }

        return $hooks;
    }
}
