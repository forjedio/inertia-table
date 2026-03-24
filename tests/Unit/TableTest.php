<?php

use Forjed\InertiaTable\Table;
use Forjed\InertiaTable\Column;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    Schema::create('test_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('status')->default('active');
        $table->timestamps();
    });

    DB::table('test_items')->insert([
        ['name' => 'First', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Second', 'status' => 'inactive', 'created_at' => now(), 'updated_at' => now()],
    ]);
});

afterEach(function () {
    Schema::dropIfExists('test_items');
});

function createTestTable()
{
    return new class(DB::table('test_items')) extends Table
    {
        protected string $defaultSort = 'id';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name')->sortable()->text(),
                Column::make('status', 'Status'),
                Column::data('id'),
            ];
        }

        protected function searchable(): array
        {
            return ['name'];
        }
    };
}

it('returns correct top-level keys from toArray', function () {
    $result = createTestTable()->simplePaginate();

    expect($result)->toHaveKeys([
        'columns', 'data', 'links', 'meta', 'searchable', 'searchDebounce', 'dateFormat', 'tableSettings', 'identifier',
    ]);
});

it('paginate and simplePaginate both return response shape', function () {
    $table1 = createTestTable();
    $result1 = $table1->simplePaginate();

    $table2 = createTestTable();
    $result2 = $table2->paginate();

    expect($result1)->toHaveKeys(['columns', 'data', 'links', 'meta', 'searchable', 'tableSettings'])
        ->and($result2)->toHaveKeys(['columns', 'data', 'links', 'meta', 'searchable', 'tableSettings'])
        ->and($result2['meta'])->toHaveKey('total');
});

it('serialises columns correctly', function () {
    $result = createTestTable()->simplePaginate();

    expect($result['columns'])->toHaveCount(3)
        ->and($result['columns'][0]['name'])->toBe('name')
        ->and($result['columns'][0]['sortable'])->toBeTrue()
        ->and($result['columns'][2]['hidden'])->toBeTrue();
});

it('maps row data correctly', function () {
    $result = createTestTable()->simplePaginate();

    expect($result['data'])->toHaveCount(2)
        ->and($result['data'][0])->toHaveKeys(['name', 'status', 'id'])
        ->and($result['data'][0]['name'])->toBe('First')
        ->and($result['data'][0]['status'])->toBe('active');
});

it('includes hidden column data in rows', function () {
    $result = createTestTable()->simplePaginate();

    expect($result['data'][0])->toHaveKey('id')
        ->and($result['data'][0]['id'])->toBe(1);
});

it('sets searchable flag correctly', function () {
    $result = createTestTable()->simplePaginate();

    expect($result['searchable'])->toBeTrue();
});

it('serialises empty tableSettings', function () {
    $result = createTestTable()->simplePaginate();

    expect($result['tableSettings'])->toBe([]);
});

it('merges table settings with withSettings', function () {
    $result = createTestTable()
        ->withSettings(['realtime' => ['channel' => 'items']])
        ->simplePaginate();

    expect($result['tableSettings'])->toHaveKey('realtime')
        ->and($result['tableSettings']['realtime']['channel'])->toBe('items');
});

it('supports make() static factory', function () {
    $table = (new class(DB::table('test_items')) extends Table
    {
        protected string $defaultSort = 'id';

        protected function columns(): array
        {
            return [Column::make('name', 'Name')];
        }
    });

    $result = $table->simplePaginate();

    expect($result['data'])->toHaveCount(2);
});

it('supports perPage fluent setter', function () {
    $result = createTestTable()->perPage(1)->simplePaginate();

    expect($result['data'])->toHaveCount(1)
        ->and($result['meta']['per_page'])->toBe(1);
});

it('supports identifier fluent setter', function () {
    $result = createTestTable()->identifier('custom')->simplePaginate();

    expect($result['meta']['current_page'])->toBe(1)
        ->and($result['identifier'])->toBe('custom');
});

it('withSettings merges with existing settings', function () {
    $table = new class(DB::table('test_items')) extends Table
    {
        protected string $defaultSort = 'id';
        protected array $tableSettings = ['existing' => true];

        protected function columns(): array
        {
            return [Column::make('name', 'Name')];
        }
    };

    $result = $table->withSettings(['new' => 'value'])->simplePaginate();

    expect($result['tableSettings'])->toBe(['existing' => true, 'new' => 'value']);
});
