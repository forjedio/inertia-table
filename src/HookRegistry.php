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
        }
    }

    /**
     * Run all beforeQuery hooks for the given table class.
     * Walks the class hierarchy so hooks on parent classes also apply.
     */
    public function runBeforeQueryHooks(string $tableClass, mixed $query, array &$columns): void
    {
        foreach ($this->resolveHooks($this->beforeQueryHooks, $tableClass) as $hook) {
            $hook($query, $columns);
        }
    }

    /**
     * Run all afterData hooks for the given table class.
     * Walks the class hierarchy so hooks on parent classes also apply.
     */
    public function runAfterDataHooks(string $tableClass, Collection $data): Collection
    {
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
