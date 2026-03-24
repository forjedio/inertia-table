<?php

use Forjed\InertiaTable\Table;
use Forjed\InertiaTable\Column;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    Schema::create('sort_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->integer('priority')->default(0);
        $table->timestamps();
    });

    DB::table('sort_items')->insert([
        ['name' => 'Charlie', 'priority' => 3, 'created_at' => '2024-01-03 00:00:00', 'updated_at' => now()],
        ['name' => 'Alice', 'priority' => 1, 'created_at' => '2024-01-01 00:00:00', 'updated_at' => now()],
        ['name' => 'Bob', 'priority' => 2, 'created_at' => '2024-01-02 00:00:00', 'updated_at' => now()],
    ]);
});

afterEach(function () {
    Schema::dropIfExists('sort_items');
});

function createSortTable($query = null)
{
    $query ??= DB::table('sort_items');

    return new class($query) extends Table
    {
        protected string $defaultSort = '-created_at';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name')->sortable(),
                Column::make('priority', 'Priority')->sortable(),
                Column::make('created_at', 'Created'),
            ];
        }
    };
}

it('applies default sort when no user sort', function () {
    $result = createSortTable()->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Charlie')
        ->and($result['data'][2]['name'])->toBe('Alice');
});

it('applies user sort by valid sortable column', function () {
    request()->merge(['sort' => 'name']);

    $result = createSortTable()->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Alice')
        ->and($result['data'][1]['name'])->toBe('Bob')
        ->and($result['data'][2]['name'])->toBe('Charlie');
});

it('falls back to default sort for invalid sort_by', function () {
    request()->merge(['sort' => 'nonexistent']);

    $result = createSortTable()->simplePaginate();

    // Should use default sort (created_at desc)
    expect($result['data'][0]['name'])->toBe('Charlie');
});

it('falls back to default sort for non-sortable column', function () {
    request()->merge(['sort' => 'created_at']);

    $result = createSortTable()->simplePaginate();

    // created_at is not marked sortable, so default sort applies
    expect($result['data'][0]['name'])->toBe('Charlie');
});

it('applies descending sort with - prefix', function () {
    request()->merge(['sort' => '-name']);

    $result = createSortTable()->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Charlie');
});

it('preserves pre-existing query orders when no user sort', function () {
    $query = DB::table('sort_items')->orderBy('priority', 'asc');

    $result = createSortTable($query)->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Alice')
        ->and($result['data'][1]['name'])->toBe('Bob')
        ->and($result['data'][2]['name'])->toBe('Charlie');
});

it('overrides pre-existing orders with user sort', function () {
    $query = DB::table('sort_items')->orderBy('priority', 'asc');

    request()->merge(['sort' => '-name']);

    $result = createSortTable($query)->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Charlie');
});
