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
