<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class EnumColumn extends Column
{
    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->enum();

        return $col;
    }
}
