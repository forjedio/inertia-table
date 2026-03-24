<?php

namespace Forjed\InertiaTable\Columns;

use Closure;
use Forjed\InertiaTable\Column;

class BadgeColumn extends Column
{
    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->badge();

        return $col;
    }

    public function colorField(string $colorField): static
    {
        $lastIndex = array_key_last($this->displays);
        if ($lastIndex !== null && $this->displays[$lastIndex]['type'] === 'badge') {
            $this->displays[$lastIndex]['color_field'] = $colorField;
        }

        return $this;
    }

    public function variant(string $variant): static
    {
        $lastIndex = array_key_last($this->displays);
        if ($lastIndex !== null && $this->displays[$lastIndex]['type'] === 'badge') {
            $this->displays[$lastIndex]['variant'] = $variant;
        }

        return $this;
    }
}
