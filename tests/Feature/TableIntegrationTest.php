<?php

use Forjed\InertiaTable\Column;
use Forjed\InertiaTable\Contracts\HasTableDisplay;
use Forjed\InertiaTable\Table;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

enum TestStatus: string implements HasTableDisplay
{
    case Active = 'active';
    case Inactive = 'inactive';

    public function getText(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Inactive => 'Inactive',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::Active => 'success',
            self::Inactive => 'danger',
        };
    }
}

function createIntegrationTable($query = null, array $settings = [])
{
    $query ??= DB::table('integration_items');

    $table = new class($query) extends Table
    {
        protected string $defaultSort = 'id';

        protected ?string $identifier = 'items';

        protected function columns(): array
        {
            return [
                Column::make('name', 'Name')
                    ->sortable()
                    ->link('items.show', ['item' => ':id']),

                Column::make('email', 'Email')
                    ->sortable()
                    ->copyable(),

                Column::make('status', 'Status')
                    ->sortable()
                    ->badge(colorField: 'status_color'),

                Column::make('created_at', 'Created')
                    ->sortable()
                    ->date(format: 'DD/MM/YYYY'),

                Column::make('combined', 'Combined')
                    ->value(fn ($m) => "{$m->name} ({$m->email})")
                    ->withIcon('user_icon')
                    ->text(),

                Column::data('id'),

                Column::data('computed', fn ($m) => strtoupper($m->name)),
            ];
        }

        protected function searchable(): array
        {
            return ['name', 'email'];
        }
    };

    if (! empty($settings)) {
        $table->withSettings($settings);
    }

    return $table;
}

beforeEach(function () {
    Schema::create('integration_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email');
        $table->string('status')->default('active');
        $table->string('status_color')->default('success');
        $table->timestamps();
    });

    DB::table('integration_items')->insert([
        ['name' => 'Alice', 'email' => 'alice@test.com', 'status' => 'active', 'status_color' => 'success', 'created_at' => '2024-01-01 10:00:00', 'updated_at' => now()],
        ['name' => 'Bob', 'email' => 'bob@test.com', 'status' => 'inactive', 'status_color' => 'danger', 'created_at' => '2024-01-02 10:00:00', 'updated_at' => now()],
        ['name' => 'Charlie', 'email' => 'charlie@test.com', 'status' => 'active', 'status_color' => 'success', 'created_at' => '2024-01-03 10:00:00', 'updated_at' => now()],
    ]);
});

afterEach(function () {
    Schema::dropIfExists('integration_items');
});

it('produces complete table output with correct structure', function () {
    $result = createIntegrationTable()->simplePaginate();

    expect($result)->toHaveKeys(['columns', 'data', 'links', 'meta', 'searchable', 'searchDebounce', 'dateFormat', 'tableSettings', 'identifier'])
        ->and($result['columns'])->toBeArray()
        ->and($result['data'])->toBeArray()
        ->and($result['links'])->toBeArray()
        ->and($result['meta'])->toBeArray()
        ->and($result['searchable'])->toBeTrue()
        ->and($result['tableSettings'])->toBe([]);
});

it('serialises all columns including hidden ones', function () {
    $result = createIntegrationTable()->simplePaginate();

    $columnNames = array_column($result['columns'], 'name');
    expect($columnNames)->toContain('name', 'email', 'status', 'created_at', 'combined', 'id', 'computed');

    $idColumn = collect($result['columns'])->firstWhere('name', 'id');
    expect($idColumn['hidden'])->toBeTrue();
});

it('maps rows with all column values and display resolvers', function () {
    $result = createIntegrationTable()->simplePaginate();

    $row = $result['data'][0];

    expect($row)
        ->toHaveKey('name', 'Alice')
        ->toHaveKey('email', 'alice@test.com')
        ->toHaveKey('status', 'active')
        ->toHaveKey('id', 1)
        ->toHaveKey('computed', 'ALICE')
        ->toHaveKey('combined');

    expect($row['combined'])->toBe('Alice (alice@test.com)');
});

it('includes multiple displays on a single column', function () {
    $result = createIntegrationTable()->simplePaginate();

    $combinedCol = collect($result['columns'])->firstWhere('name', 'combined');

    expect($combinedCol['displays'])->toHaveCount(2)
        ->and($combinedCol['displays'][0]['type'])->toBe('icon')
        ->and($combinedCol['displays'][1]['type'])->toBe('text');
});

it('search filters rows correctly', function () {
    request()->merge(['itemsSearch' => 'bob']);

    $result = createIntegrationTable()->simplePaginate();

    expect($result['data'])->toHaveCount(1)
        ->and($result['data'][0]['name'])->toBe('Bob');
});

it('sort orders rows correctly', function () {
    request()->merge(['itemsSort' => '-name']);

    $result = createIntegrationTable()->simplePaginate();

    expect($result['data'][0]['name'])->toBe('Charlie')
        ->and($result['data'][2]['name'])->toBe('Alice');
});

it('pagination returns correct page', function () {
    $result = createIntegrationTable()->perPage(2)->simplePaginate();

    expect($result['data'])->toHaveCount(2)
        ->and($result['meta']['per_page'])->toBe(2)
        ->and($result['links']['next'])->not->toBeNull();
});

it('custom identifier scopes page param', function () {
    request()->merge(['itemsPage' => 2]);

    $result = createIntegrationTable()->perPage(2)->simplePaginate();

    expect($result['meta']['current_page'])->toBe(2)
        ->and($result['data'])->toHaveCount(1)
        ->and($result['data'][0]['name'])->toBe('Charlie');
});

it('link display serialises route and params', function () {
    $result = createIntegrationTable()->simplePaginate();

    $nameCol = collect($result['columns'])->firstWhere('name', 'name');

    expect($nameCol['displays'][0])
        ->type->toBe('link')
        ->route->toBe('items.show')
        ->params->toBe(['item' => ':id'])
        ->prefetch->toBeTrue();
});

it('badge display serialises color_field', function () {
    $result = createIntegrationTable()->simplePaginate();

    $statusCol = collect($result['columns'])->firstWhere('name', 'status');

    expect($statusCol['displays'][0])
        ->type->toBe('badge')
        ->color_field->toBe('status_color');
});

it('date display serialises format', function () {
    $result = createIntegrationTable()->simplePaginate();

    $dateCol = collect($result['columns'])->firstWhere('name', 'created_at');

    expect($dateCol['displays'][0])
        ->type->toBe('date')
        ->format->toBe('DD/MM/YYYY');
});

it('copyable display serialises correctly', function () {
    $result = createIntegrationTable()->simplePaginate();

    $emailCol = collect($result['columns'])->firstWhere('name', 'email');

    expect($emailCol['displays'][0]['type'])->toBe('copyable');
});

it('tableSettings are included in output', function () {
    $result = createIntegrationTable(settings: [
        'realtime' => ['channel' => 'items', 'events' => ['ItemUpdated']],
    ])->simplePaginate();

    expect($result['tableSettings']['realtime'])
        ->channel->toBe('items')
        ->events->toBe(['ItemUpdated']);
});

it('toArray returns flat row data without pagination', function () {
    $result = createIntegrationTable()->toArray();

    expect($result)->toBeArray()
        ->and($result)->toHaveCount(3)
        ->and($result[0])->toHaveKey('name', 'Alice')
        ->and($result[0])->toHaveKey('id', 1);
});

it('toCollection returns Collection of rows', function () {
    $result = createIntegrationTable()->toCollection();

    expect($result)->toBeInstanceOf(Collection::class)
        ->and($result)->toHaveCount(3)
        ->and($result->first())->toHaveKey('name', 'Alice');
});

it('toArray supports take and skip', function () {
    $result = createIntegrationTable()->toArray(take: 2);

    expect($result)->toHaveCount(2);

    $result = createIntegrationTable()->toArray(take: 1, skip: 1);

    expect($result)->toHaveCount(1)
        ->and($result[0]['name'])->toBe('Bob');
});

it('search and sort work together', function () {
    request()->merge(['itemsSearch' => 'test.com', 'itemsSort' => '-name']);

    $result = createIntegrationTable()->simplePaginate();

    expect($result['data'])->toHaveCount(3)
        ->and($result['data'][0]['name'])->toBe('Charlie')
        ->and($result['data'][2]['name'])->toBe('Alice');
});
