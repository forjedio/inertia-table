<?php

namespace Forjed\InertiaTable;

use Closure;
use Forjed\InertiaTable\Contracts\HasTableDisplay;

class Column
{
    protected string $name;

    protected string $header;

    protected ?string $accessor = null;

    protected bool $sortable = false;

    protected bool $hidden = false;

    protected bool $fit = false;

    protected array $displays = [];

    protected array $displayResolvers = [];

    protected ?Closure $valueResolver = null;

    /** @var array<int, Closure> */
    protected array $adjusters = [];

    protected array $iconDisplay = ['type' => 'icon'];

    protected bool $iconOnly = false;

    public function __construct(string $name, string $header)
    {
        if (str_contains($name, '.')) {
            $this->accessor = $name;
            $this->name = '_'.str_replace('.', '_', $name);
        } else {
            $this->name = $name;
        }

        $this->header = $header;
    }

    public static function make(string $name, string $header): static
    {
        return new static($name, $header);
    }

    /**
     * Hidden data-only column.
     * Shortcut for Column::make($name, '')->hidden()
     */
    public static function data(string $name, ?Closure $value = null): static
    {
        $col = new static($name, '');
        $col->hidden = true;

        if ($value) {
            $col->valueResolver = $value;
        }

        return $col;
    }

    // --- Fluent setters ---

    public function accessor(string $accessor): static
    {
        $this->accessor = $accessor;

        return $this;
    }

    public function sortable(bool $sortable = true): static
    {
        $this->sortable = $sortable;

        return $this;
    }

    public function hidden(bool $hidden = true): static
    {
        $this->hidden = $hidden;

        return $this;
    }

    public function fit(bool $fit = true): static
    {
        $this->fit = $fit;

        return $this;
    }

    public function value(Closure $resolver): static
    {
        $this->valueResolver = $resolver;

        return $this;
    }

    public function adjust(Closure $adjuster): static
    {
        $this->adjusters[] = $adjuster;

        return $this;
    }

    public function uppercase(): static
    {
        return $this->adjust(fn ($value) => is_string($value) ? strtoupper($value) : $value);
    }

    public function lowercase(): static
    {
        return $this->adjust(fn ($value) => is_string($value) ? strtolower($value) : $value);
    }

    public function ucFirst(): static
    {
        return $this->adjust(fn ($value) => is_string($value) ? ucfirst($value) : $value);
    }

    public function ucWords(): static
    {
        return $this->adjust(fn ($value) => is_string($value) ? ucwords($value) : $value);
    }

    public function fallback(mixed $default = 'N/A'): static
    {
        return $this->adjust(fn ($value) => $value ?? $default);
    }

    // --- Display modifiers ---

    public function text(string|Closure|null $value = null): static
    {
        $display = ['type' => 'text'];
        $this->resolveDisplayValue($display, $value, 'key');
        $this->displays[] = $display;

        return $this;
    }

    public function badge(
        string|Closure|null $value = null,
        ?string $colorField = null,
        ?string $variant = null,
        string|Closure|null $tooltip = null,
    ): static {
        $display = ['type' => 'badge'];
        $this->resolveDisplayValue($display, $value, 'key');

        if ($colorField) {
            $display['color_field'] = $colorField;
        }
        if ($variant) {
            $display['variant'] = $variant;
        }

        $this->resolveDisplayValue($display, $tooltip, 'tooltip_key');

        $this->displays[] = $display;

        return $this;
    }

    public function date(string|Closure|null $value = null, ?string $format = null): static
    {
        $display = ['type' => 'date'];
        $this->resolveDisplayValue($display, $value, 'key');

        if ($format) {
            $display['format'] = $format;
        }

        $this->displays[] = $display;

        return $this;
    }

    public function link(string $routeName, array $routeParams = [], string|Closure|null $value = null, bool $prefetch = true): static
    {
        $display = ['type' => 'link', 'prefetch' => $prefetch];

        if (config('inertia-table.use_ziggy', true)) {
            $display['route'] = $routeName;
            $display['params'] = $routeParams;
        } else {
            $resolver = function ($model) use ($routeName, $routeParams) {
                $resolved = [];

                foreach ($routeParams as $key => $param) {
                    if (is_string($param) && str_starts_with($param, ':')) {
                        $resolved[$key] = data_get($model, substr($param, 1));
                    } else {
                        $resolved[$key] = $param;
                    }
                }

                return route($routeName, $resolved);
            };

            $this->resolveDisplayValue($display, $resolver, 'href_key');
        }

        $this->resolveDisplayValue($display, $value, 'key');
        $this->displays[] = $display;

        return $this;
    }

    public function copyable(string|Closure|null $value = null): static
    {
        $display = ['type' => 'copyable'];
        $this->resolveDisplayValue($display, $value, 'key');
        $this->displays[] = $display;

        return $this;
    }

    /**
     * Render an icon alongside other displays.
     * The icon is prepended before other display types.
     * For badges, the icon renders inside the badge.
     *
     * @param  string|array|Closure  $icon  Fixed name, map [value => icon], or closure
     * @param  string|null  $default  Fallback icon when using a map
     */
    public function withIcon(string|array|Closure $icon, ?string $default = null): static
    {
        $resolver = $this->buildIconResolver($icon, $default);
        $this->resolveDisplayValue($this->iconDisplay, $resolver, 'key');

        return $this;
    }

    /**
     * Render ONLY an icon (no other display types).
     *
     * @param  string|array|Closure  $icon  Fixed name, map [value => icon], or closure
     * @param  string|null  $default  Fallback icon when using a map
     */
    public function asIcon(string|array|Closure $icon, ?string $default = null): static
    {
        $resolver = $this->buildIconResolver($icon, $default);
        $display = ['type' => 'icon'];
        $this->resolveDisplayValue($display, $resolver, 'key');
        $this->displays[] = $display;
        $this->iconOnly = true;

        return $this;
    }

    public function component(string $component): static
    {
        $this->displays[] = ['type' => 'component', 'component' => $component];

        return $this;
    }

    /**
     * Enum integration.
     * Resolves getText() for value and getColor() for badge variant
     * from any enum implementing HasTableDisplay.
     */
    public function enum(): static
    {
        $accessor = $this->accessor ?? $this->name;

        $this->valueResolver = function ($model) use ($accessor) {
            $value = data_get($model, $accessor);

            return $value instanceof HasTableDisplay ? $value->getText() : $value;
        };

        $colorKey = "_{$this->name}_enum_color";

        $this->displayResolvers[] = [
            'key' => $colorKey,
            'resolver' => function ($model) use ($accessor) {
                $value = data_get($model, $accessor);

                return $value instanceof HasTableDisplay ? $value->getColor() : null;
            },
        ];

        $this->displays[] = ['type' => 'badge', 'color_field' => $colorKey];

        return $this;
    }

    // --- Value resolution ---

    public function getValue(mixed $model): mixed
    {
        $value = $this->valueResolver
            ? ($this->valueResolver)($model)
            : data_get($model, $this->accessor ?? $this->name);

        foreach ($this->adjusters as $adjuster) {
            $value = $adjuster($value);
        }

        return $value;
    }

    public function resolveDisplayValues(mixed $model): array
    {
        $values = [];

        foreach ($this->displayResolvers as $resolver) {
            $values[$resolver['key']] = ($resolver['resolver'])($model);
        }

        return $values;
    }

    // --- Serialisation ---

    public function toArray(): array
    {
        // asIcon: only return the icon display, ignore any other displays added after
        if ($this->iconOnly) {
            $displays = array_values(array_filter(
                $this->displays,
                fn ($d) => $d['type'] === 'icon',
            ));

            return [
                'name' => $this->name,
                'header' => $this->header,
                'sortable' => $this->sortable,
                'sort_key' => $this->accessor ?? $this->name,
                'hidden' => $this->hidden,
                'fit' => $this->fit,
                'displays' => $displays,
            ];
        }

        $displays = $this->displays;

        // withIcon: prepend icon display before other displays, and add icon_key to badges
        if (isset($this->iconDisplay['key'])) {
            $iconKey = $this->iconDisplay['key'];

            // Add icon_key to any badge displays so the icon renders inside the badge
            $displays = array_map(function ($display) use ($iconKey) {
                if ($display['type'] === 'badge') {
                    $display['icon_key'] = $iconKey;
                }

                return $display;
            }, $displays);

            // Prepend icon display (for non-badge display pipelines)
            $hasBadge = collect($displays)->contains(fn ($d) => $d['type'] === 'badge');
            if (! $hasBadge) {
                array_unshift($displays, $this->iconDisplay);
            }
        }

        return [
            'name' => $this->name,
            'header' => $this->header,
            'sortable' => $this->sortable,
            'sort_key' => $this->accessor ?? $this->name,
            'hidden' => $this->hidden,
            'fit' => $this->fit,
            'displays' => $displays,
        ];
    }

    // --- Getters ---

    public function getName(): string
    {
        return $this->name;
    }

    public function getHeader(): string
    {
        return $this->header;
    }

    public function getAccessor(): string
    {
        return $this->accessor ?? $this->name;
    }

    public function getSortKey(): string
    {
        return $this->accessor ?? $this->name;
    }

    public function isSortable(): bool
    {
        return $this->sortable;
    }

    public function isHidden(): bool
    {
        return $this->hidden;
    }

    // --- Internal ---

    /**
     * Build a closure that resolves an icon name from the model.
     */
    protected function buildIconResolver(string|array|Closure $icon, ?string $default): string|Closure
    {
        if (is_string($icon)) {
            return fn () => $icon;
        }

        if (is_array($icon)) {
            $map = $icon;
            $accessor = $this->accessor ?? $this->name;

            return function ($model) use ($map, $accessor, $default) {
                $value = data_get($model, $accessor);

                // If it's an enum with HasTableDisplay, match against getText()
                if ($value instanceof HasTableDisplay) {
                    $value = $value->getText();
                }

                return $map[$value] ?? $default;
            };
        }

        // Closure - pass through
        return $icon;
    }

    protected function resolveDisplayValue(array &$display, string|Closure|null $value, string $keyName): void
    {
        if ($value instanceof Closure) {
            $autoKey = "_{$this->name}_d".count($this->displays)."_{$keyName}";

            $this->displayResolvers[] = [
                'key' => $autoKey,
                'resolver' => $value,
            ];

            $display[$keyName] = $autoKey;
        } elseif (is_string($value)) {
            $display[$keyName] = $value;
        }
        // null = frontend uses column's own value (no key set)
    }
}
