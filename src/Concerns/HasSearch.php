<?php

namespace Forjed\InertiaTable\Concerns;

trait HasSearch
{
    protected function applySearch(): void
    {
        $search = request()->input($this->getSearchParam());
        $fields = $this->searchable();

        if (empty($search) || empty($fields)) {
            return;
        }

        $this->query->where(function ($q) use ($search, $fields) {
            foreach ($fields as $field) {
                $q->orWhere($field, 'LIKE', "%{$search}%");
            }
        });
    }
}
