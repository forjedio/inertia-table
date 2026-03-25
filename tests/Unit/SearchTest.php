<?php

use Forjed\InertiaTable\Column;
use Forjed\InertiaTable\Table;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    Schema::create('search_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email');
        $table->string('role')->default('user');
        $table->timestamps();
    });

    DB::table('search_items')->insert([
        ['name' => 'Alice Smith', 'email' => 'alice@example.com', 'role' => 'admin', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Bob Jones', 'email' => 'bob@example.com', 'role' => 'user', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Charlie Brown', 'email' => 'charlie@test.com', 'role' => 'user', 'created_at' => now(), 'updated_at' => now()],
    ]);
});

afterEach(function () {
    Schema::dropIfExists('search_items');
});

function createSearchTable()
{
    return new class(DB::table('search_items')) extends Table
    {
        protected string $defaultSort = 'id';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name'),
                Column::make('email', 'Email'),
            ];
        }

        protected function searchable(): array
        {
            return ['name', 'email'];
        }
    };
}

function createNonSearchableTable()
{
    return new class(DB::table('search_items')) extends Table
    {
        protected string $defaultSort = 'id';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name'),
            ];
        }
    };
}

it('filters results by search term', function () {
    request()->merge(['search' => 'alice']);

    $result = createSearchTable()->simplePaginate();

    expect($result['data'])->toHaveCount(1)
        ->and($result['data'][0]['name'])->toBe('Alice Smith');
});

it('searches across multiple fields', function () {
    request()->merge(['search' => 'test.com']);

    $result = createSearchTable()->simplePaginate();

    expect($result['data'])->toHaveCount(1)
        ->and($result['data'][0]['name'])->toBe('Charlie Brown');
});

it('returns all results when search term is empty', function () {
    request()->merge(['search' => '']);

    $result = createSearchTable()->simplePaginate();

    expect($result['data'])->toHaveCount(3);
});

it('returns all results when no search param', function () {
    $result = createSearchTable()->simplePaginate();

    expect($result['data'])->toHaveCount(3);
});

it('skips search when searchable returns empty array', function () {
    request()->merge(['search' => 'alice']);

    $result = createNonSearchableTable()->simplePaginate();

    expect($result['data'])->toHaveCount(3)
        ->and($result['searchable'])->toBeFalse();
});
