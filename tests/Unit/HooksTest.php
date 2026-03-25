<?php

use Forjed\InertiaTable\Column;
use Forjed\InertiaTable\Table;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    Schema::create('hook_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('status')->default('active');
        $table->timestamps();
    });

    DB::table('hook_items')->insert([
        ['name' => 'Alice', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Bob', 'status' => 'inactive', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Charlie', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
    ]);
});

afterEach(function () {
    Schema::dropIfExists('hook_items');
    Table::clearHooks();
});

function createHookTable()
{
    return new class(DB::table('hook_items')) extends Table
    {
        protected string $defaultSort = 'id';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name')->sortable(),
                Column::make('status', 'Status'),
            ];
        }
    };
}

function createChildHookTable()
{
    // A concrete parent class for inheritance testing
    return new class(DB::table('hook_items')) extends Table
    {
        protected string $defaultSort = 'id';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name'),
                Column::make('status', 'Status'),
            ];
        }
    };
}

it('beforeQuery modifies query with where clause', function () {
    $tableClass = createHookTable()::class;

    Table::beforeQuery($tableClass, function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'])->toHaveCount(2)
        ->and($result['data'][0]['name'])->toBe('Alice')
        ->and($result['data'][1]['name'])->toBe('Charlie');
});

it('beforeQuery modifies columns by reference', function () {
    $tableClass = createHookTable()::class;

    Table::beforeQuery($tableClass, function ($query, array &$columns) {
        $columns[] = Column::data('id');
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    // The hidden id column should be in the serialized columns
    $columnNames = array_column($result['columns'], 'name');
    expect($columnNames)->toContain('id');

    // And the data should include id values
    expect($result['data'][0])->toHaveKey('id');
});

it('beforeQuery works with toArray output', function () {
    $tableClass = createHookTable()::class;

    Table::beforeQuery($tableClass, function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    $result = (new $tableClass(DB::table('hook_items')))->toArray();

    expect($result)->toHaveCount(2);
});

it('beforeQuery works with toCollection output', function () {
    $tableClass = createHookTable()::class;

    Table::beforeQuery($tableClass, function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    $result = (new $tableClass(DB::table('hook_items')))->toCollection();

    expect($result)->toHaveCount(2);
});

it('afterData transforms row data', function () {
    $tableClass = createHookTable()::class;

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'][0]['name'])->toBe('ALICE')
        ->and($result['data'][1]['name'])->toBe('BOB');
});

it('afterData returning null keeps original data', function () {
    $tableClass = createHookTable()::class;

    Table::afterData($tableClass, function (Collection $rows) {
        return null;
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'])->toHaveCount(3)
        ->and($result['data'][0]['name'])->toBe('Alice');
});

it('afterData adds computed fields to rows', function () {
    $tableClass = createHookTable()::class;

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name_upper'] = strtoupper($row['name']);

            return $row;
        });
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'][0])->toHaveKey('name_upper', 'ALICE');
});

it('afterData works with toCollection output', function () {
    $tableClass = createHookTable()::class;

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    $result = (new $tableClass(DB::table('hook_items')))->toCollection();

    expect($result->first()['name'])->toBe('ALICE');
});

it('multiple hooks stack in registration order', function () {
    $tableClass = createHookTable()::class;

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = $row['name'].'!';

            return $row;
        });
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    // First hook uppercases, second appends "!"
    expect($result['data'][0]['name'])->toBe('ALICE!');
});

it('hooks are scoped to specific table class', function () {
    $tableClass = createHookTable()::class;

    // Register hook on a different class
    Table::beforeQuery('App\Tables\SomeOtherTable', function ($query, array &$columns) {
        $query->where('status', 'nonexistent');
    });

    // Our table should not be affected
    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'])->toHaveCount(3);
});

it('clearHooks removes all hooks', function () {
    $tableClass = createHookTable()::class;

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = 'HOOKED';

            return $row;
        });
    });

    Table::clearHooks();

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Alice');
});

it('clearHooks with class only clears that class', function () {
    $tableClass = createHookTable()::class;

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = 'HOOKED';

            return $row;
        });
    });

    // Clear a different class - our hook should remain
    Table::clearHooks('App\Tables\SomeOtherTable');

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'][0]['name'])->toBe('HOOKED');
});

it('beforeQuery and afterData work together', function () {
    $tableClass = createHookTable()::class;

    Table::beforeQuery($tableClass, function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'])->toHaveCount(2)
        ->and($result['data'][0]['name'])->toBe('ALICE')
        ->and($result['data'][1]['name'])->toBe('CHARLIE');
});


it('globalBeforeQuery modifies query on all tables', function () {
    Table::globalBeforeQuery(function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    $result = createHookTable()->simplePaginate();

    expect($result['data'])->toHaveCount(2)
        ->and($result['data'][0]['name'])->toBe('Alice')
        ->and($result['data'][1]['name'])->toBe('Charlie');
});

it('globalBeforeQuery modifies columns by reference', function () {
    Table::globalBeforeQuery(function ($query, array &$columns) {
        $columns[] = Column::data('id');
    });

    $result = createHookTable()->simplePaginate();

    $columnNames = array_column($result['columns'], 'name');
    expect($columnNames)->toContain('id')
        ->and($result['data'][0])->toHaveKey('id');
});

it('globalAfterData transforms data on all tables', function () {
    Table::globalAfterData(function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    $result = createHookTable()->simplePaginate();

    expect($result['data'][0]['name'])->toBe('ALICE')
        ->and($result['data'][1]['name'])->toBe('BOB');
});

it('global hooks run before class-specific hooks', function () {
    $order = [];
    $tableClass = createHookTable()::class;

    Table::globalAfterData(function (Collection $rows) use (&$order) {
        $order[] = 'global';

        return $rows;
    });

    Table::afterData($tableClass, function (Collection $rows) use (&$order) {
        $order[] = 'specific';

        return $rows;
    });

    (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($order)->toBe(['global', 'specific']);
});

it('global afterData returning null keeps original data', function () {
    Table::globalAfterData(function (Collection $rows) {
        return null;
    });

    $result = createHookTable()->simplePaginate();

    expect($result['data'])->toHaveCount(3)
        ->and($result['data'][0]['name'])->toBe('Alice');
});

it('global and class-specific hooks compose correctly', function () {
    $tableClass = createHookTable()::class;

    Table::globalBeforeQuery(function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    expect($result['data'])->toHaveCount(2)
        ->and($result['data'][0]['name'])->toBe('ALICE')
        ->and($result['data'][1]['name'])->toBe('CHARLIE');
});

it('multiple global hooks stack in registration order', function () {
    Table::globalAfterData(function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    Table::globalAfterData(function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = $row['name'].'!';

            return $row;
        });
    });

    $result = createHookTable()->simplePaginate();

    expect($result['data'][0]['name'])->toBe('ALICE!');
});

it('clearHooks removes global hooks too', function () {
    Table::globalAfterData(function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = 'HOOKED';

            return $row;
        });
    });

    Table::clearHooks();

    $result = createHookTable()->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Alice');
});

it('clearGlobalHooks only clears global hooks', function () {
    $tableClass = createHookTable()::class;

    Table::globalAfterData(function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = 'GLOBAL';

            return $row;
        });
    });

    Table::afterData($tableClass, function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    Table::clearGlobalHooks();

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    // Global hook cleared, but class-specific remains
    expect($result['data'][0]['name'])->toBe('ALICE');
});

it('clearHooks with class does not clear global hooks', function () {
    $tableClass = createHookTable()::class;

    Table::globalAfterData(function (Collection $rows) {
        return $rows->map(function (array $row) {
            $row['name'] = strtoupper($row['name']);

            return $row;
        });
    });

    Table::clearHooks($tableClass);

    $result = (new $tableClass(DB::table('hook_items')))->simplePaginate();

    // Global hook should still be active
    expect($result['data'][0]['name'])->toBe('ALICE');
});

it('global hooks fire on different table classes', function () {
    Table::globalBeforeQuery(function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    $result1 = createHookTable()->simplePaginate();
    $result2 = createChildHookTable()->simplePaginate();

    expect($result1['data'])->toHaveCount(2)
        ->and($result2['data'])->toHaveCount(2);
});

it('global hooks work with toArray and toCollection output', function () {
    Table::globalBeforeQuery(function ($query, array &$columns) {
        $query->where('status', 'active');
    });

    $array = createHookTable()->toArray();
    $collection = createHookTable()->toCollection();

    expect($array)->toHaveCount(2)
        ->and($collection)->toHaveCount(2);
});

it('global hook receives table class as trailing parameter', function () {
    $receivedClass = null;

    Table::globalBeforeQuery(function ($query, array &$columns, string $tableClass) use (&$receivedClass) {
        $receivedClass = $tableClass;
    });

    $table = createHookTable();
    $table->simplePaginate();

    expect($receivedClass)->toBe($table::class);
});
