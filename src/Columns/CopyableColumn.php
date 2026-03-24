<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class CopyableColumn extends Column
{
    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->copyable();

        return $col;
    }
}
