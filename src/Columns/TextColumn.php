<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class TextColumn extends Column
{
    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->text();

        return $col;
    }
}
