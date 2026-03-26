<?php

namespace Forjed\InertiaTable\Columns;

class DateTimeColumn extends DateColumn
{
    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->format('Y-m-d H:i:s');

        return $col;
    }

    public function toLocal(bool $local = true): static
    {
        parent::toLocal($local);

        if ($local && count($this->displays) > 0) {
            $this->displays[count($this->displays) - 1]['includeTime'] = true;
        }

        return $this;
    }
}
