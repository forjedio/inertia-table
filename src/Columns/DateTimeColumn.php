<?php

namespace Forjed\InertiaTable\Columns;

class DateTimeColumn extends DateColumn
{
    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->date(format: 'YYYY-MM-DD HH:mm:ss');

        return $col;
    }
}
