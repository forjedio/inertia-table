<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class DateColumn extends Column
{
    protected ?string $format = null;

    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->date();

        return $col;
    }

    public function format(string $format): static
    {
        $this->format = $format;

        // Replace the last date display with the updated format
        $lastIndex = array_key_last($this->displays);
        if ($lastIndex !== null && $this->displays[$lastIndex]['type'] === 'date') {
            $this->displays[$lastIndex]['format'] = $format;
        }

        return $this;
    }
}
