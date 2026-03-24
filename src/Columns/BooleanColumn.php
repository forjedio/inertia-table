<?php

namespace Forjed\InertiaTable\Columns;

use Forjed\InertiaTable\Column;

class BooleanColumn extends Column
{
    protected static string $defaultYesText = 'Yes';

    protected static string $defaultNoText = 'No';

    protected string $yesText;

    protected string $noText;

    public static function make(string $name, string $header): static
    {
        $col = new static($name, $header);
        $col->yesText = static::$defaultYesText;
        $col->noText = static::$defaultNoText;
        $col->applyBooleanDisplay();

        return $col;
    }

    public static function defaultYesText(string $text): void
    {
        static::$defaultYesText = $text;
    }

    public static function defaultNoText(string $text): void
    {
        static::$defaultNoText = $text;
    }

    public function yesText(string $text): static
    {
        $this->yesText = $text;
        $this->applyBooleanDisplay();

        return $this;
    }

    public function noText(string $text): static
    {
        $this->noText = $text;
        $this->applyBooleanDisplay();

        return $this;
    }

    protected function applyBooleanDisplay(): void
    {
        $yesText = $this->yesText;
        $noText = $this->noText;

        $this->valueResolver = fn ($model) => data_get($model, $this->getAccessor()) ? $yesText : $noText;

        $this->displays = [['type' => 'text']];
        $this->displayResolvers = [];
    }
}
