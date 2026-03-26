<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class DateColumn extends Column
{
    protected ?string $format = null;

    protected bool $local = false;

    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->applyDateDisplay();

        return $col;
    }

    public function format(string $format): static
    {
        $this->format = $format;
        $this->applyDateDisplay();

        return $this;
    }

    public function toLocal(bool $local = true): static
    {
        $this->local = $local;
        $this->applyDateDisplay();

        return $this;
    }

    protected function applyDateDisplay(): void
    {
        $this->displays = [];
        $this->displayResolvers = [];
        $this->date(format: $this->format, local: $this->local);
    }
}
