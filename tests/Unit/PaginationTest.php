<?php

use Forjed\InertiaTable\Column;
use Forjed\InertiaTable\Table;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    Schema::create('page_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->timestamps();
    });

    for ($i = 1; $i <= 25; $i++) {
        DB::table('page_items')->insert([
            'name' => "Item {$i}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
});

afterEach(function () {
    Schema::dropIfExists('page_items');
});

function createPageTable(int $perPage = 10)
{
    $table = new class(DB::table('page_items')) extends Table
    {
        protected string $defaultSort = 'id';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name'),
            ];
        }
    };

    return $table->perPage($perPage);
}

it('uses simple pagination by default', function () {
    $result = createPageTable()->simplePaginate();

    expect($result['data'])->toHaveCount(10)
        ->and($result['meta']['current_page'])->toBe(1)
        ->and($result['meta']['per_page'])->toBe(10)
        ->and($result['links']['next'])->not->toBeNull()
        ->and($result['links']['first'])->toBeNull()  // simple pagination has no first/last
        ->and($result['links']['last'])->toBeNull()
        ->and($result['meta'])->not->toHaveKey('total');
});

it('uses full pagination', function () {
    $result = createPageTable()->paginate();

    expect($result['data'])->toHaveCount(10)
        ->and($result['meta']['total'])->toBe(25)
        ->and($result['meta']['last_page'])->toBe(3)
        ->and($result['links']['first'])->not->toBeNull()
        ->and($result['links']['last'])->not->toBeNull();
});

it('respects custom perPage', function () {
    $result = createPageTable(5)->simplePaginate();

    expect($result['data'])->toHaveCount(5)
        ->and($result['meta']['per_page'])->toBe(5);
});

it('returns correct meta shape for simple pagination', function () {
    $result = createPageTable()->simplePaginate();

    expect($result['meta'])->toHaveKeys([
        'current_page', 'current_page_url', 'from', 'path', 'per_page', 'to',
    ]);
});

it('returns correct links shape', function () {
    $result = createPageTable()->simplePaginate();

    expect($result['links'])->toHaveKeys(['first', 'last', 'prev', 'next'])
        ->and($result['links']['prev'])->toBeNull()  // page 1 has no prev
        ->and($result['links']['next'])->not->toBeNull();
});

it('paginates to second page', function () {
    request()->merge(['page' => 2]);

    $result = createPageTable()->simplePaginate();

    expect($result['data'])->toHaveCount(10)
        ->and($result['meta']['current_page'])->toBe(2)
        ->and($result['data'][0]['name'])->toBe('Item 11');
});

it('supports identifier for scoped page param', function () {
    $table = createPageTable()->identifier('items');

    request()->merge(['itemsPage' => 2]);

    $result = $table->simplePaginate();

    expect($result['meta']['current_page'])->toBe(2)
        ->and($result['data'][0]['name'])->toBe('Item 11');
});
