<?php

namespace Forjed\InertiaTable\Contracts;

interface HasTableDisplay
{
    /** Display text for the value (e.g. 'Ready', 'Failed'). */
    public function getText(): string;

    /** Badge variant/colour name (e.g. 'success', 'danger', 'warning'). */
    public function getColor(): string;
}
