<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class ComponentColumn extends Column
{
    public static function create(string $name, string $header, string $component): static
    {
        $col = new static($name, $header);
        $col->component($component);

        return $col;
    }
}
