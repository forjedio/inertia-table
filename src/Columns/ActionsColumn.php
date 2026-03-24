<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class ActionsColumn extends Column
{
    public static function make(string $name = 'actions', string $header = ''): static
    {
        $col = new static($name, $header);
        $col->displays = [['type' => 'actions']];
        $col->fit = true;

        return $col;
    }
}
