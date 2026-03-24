<?php

namespace Forjed\InertiaTable\Columns;

use Closure;
use Forjed\InertiaTable\Column;

class LinkColumn extends Column
{
    public static function make(string $name, string $header): static
    {
        return new static($name, $header);
    }

    public function route(string $routeName, array $routeParams = [], bool $prefetch = true): static
    {
        $this->link($routeName, $routeParams, prefetch: $prefetch);

        return $this;
    }
}
