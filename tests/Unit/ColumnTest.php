<?php

use Forjed\InertiaTable\Column;
use Forjed\InertiaTable\Contracts\HasTableDisplay;

it('creates a column with make()', function () {
    $col = Column::make('name', 'Name');

    expect($col->getName())->toBe('name')
        ->and($col->getHeader())->toBe('Name')
        ->and($col->isSortable())->toBeFalse()
        ->and($col->isHidden())->toBeFalse();
});

it('creates a hidden data column with data()', function () {
    $col = Column::data('id');

    expect($col->isHidden())->toBeTrue()
        ->and($col->getHeader())->toBe('')
        ->and($col->getName())->toBe('id');
});

it('creates a data column with custom value resolver', function () {
    $col = Column::data('full_name', fn ($m) => $m->first.' '.$m->last);

    $model = (object) ['first' => 'John', 'last' => 'Doe'];
    expect($col->getValue($model))->toBe('John Doe');
});

it('sets sortable via fluent setter', function () {
    $col = Column::make('name', 'Name')->sortable();

    expect($col->isSortable())->toBeTrue();
});

it('sets hidden via fluent setter', function () {
    $col = Column::make('name', 'Name')->hidden();

    expect($col->isHidden())->toBeTrue();
});

it('sets accessor and uses it for sort_key', function () {
    $col = Column::make('name', 'Name')->accessor('users.name');

    expect($col->getAccessor())->toBe('users.name')
        ->and($col->getSortKey())->toBe('users.name');
});

it('resolves value from model using accessor', function () {
    $col = Column::make('name', 'Name')->accessor('details.name');

    $model = (object) ['details' => (object) ['name' => 'Test']];
    expect($col->getValue($model))->toBe('Test');
});

it('resolves value using custom value resolver', function () {
    $col = Column::make('name', 'Name')->value(fn ($m) => strtoupper($m->name));

    $model = (object) ['name' => 'test'];
    expect($col->getValue($model))->toBe('TEST');
});

it('adds text display', function () {
    $col = Column::make('name', 'Name')->text();
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('text');
});

it('adds text display with string key', function () {
    $col = Column::make('name', 'Name')->text('other_field');
    $arr = $col->toArray();

    expect($arr['displays'][0]['key'])->toBe('other_field');
});

it('adds text display with closure key and generates auto-key', function () {
    $col = Column::make('status', 'Status')->text(fn ($m) => strtoupper($m->status));
    $arr = $col->toArray();

    expect($arr['displays'][0]['key'])->toBe('_status_d0_key');
});

it('adds badge display with all options', function () {
    $col = Column::make('status', 'Status')->badge(
        value: null,
        colorField: 'status_color',
        variant: 'outline',
        tooltip: 'tooltip_field',
    );
    $arr = $col->toArray();

    expect($arr['displays'][0])
        ->type->toBe('badge')
        ->color_field->toBe('status_color')
        ->variant->toBe('outline')
        ->tooltip_key->toBe('tooltip_field');
});

it('adds badge display with closure tooltip', function () {
    $col = Column::make('status', 'Status')->badge(
        tooltip: fn ($m) => "Details: {$m->status}",
    );
    $arr = $col->toArray();

    expect($arr['displays'][0]['tooltip_key'])->toBe('_status_d0_tooltip_key');
});

it('adds date display with formatted_key and raw_key', function () {
    $col = Column::make('created_at', 'Created')->date();
    $arr = $col->toArray();

    expect($arr['displays'][0]['type'])->toBe('date')
        ->and($arr['displays'][0])->toHaveKey('formatted_key')
        ->and($arr['displays'][0])->toHaveKey('raw_key');
});

it('date display resolves PHP-formatted value and raw ISO', function () {
    $col = Column::make('created_at', 'Created')->date(format: 'd/m/Y');

    $model = (object) ['created_at' => '2027-03-01 10:30:00'];
    $displayValues = $col->resolveDisplayValues($model);

    $arr = $col->toArray();
    $formattedKey = $arr['displays'][0]['formatted_key'];
    $rawKey = $arr['displays'][0]['raw_key'];

    expect($displayValues[$formattedKey])->toBe('01/03/2027')
        ->and($displayValues[$rawKey])->toContain('2027-03-01T');
});

it('date display returns null for null values', function () {
    $col = Column::make('created_at', 'Created')->date();

    $model = (object) ['created_at' => null];
    $displayValues = $col->resolveDisplayValues($model);

    $arr = $col->toArray();
    $formattedKey = $arr['displays'][0]['formatted_key'];
    $rawKey = $arr['displays'][0]['raw_key'];

    expect($displayValues[$formattedKey])->toBeNull()
        ->and($displayValues[$rawKey])->toBeNull();
});

it('date display with local flag', function () {
    $col = Column::make('created_at', 'Created')->date(local: true);
    $arr = $col->toArray();

    expect($arr['displays'][0]['local'])->toBeTrue();
});

it('date display does not set local by default', function () {
    $col = Column::make('created_at', 'Created')->date();
    $arr = $col->toArray();

    expect($arr['displays'][0])->not->toHaveKey('local');
});

it('date display does not overwrite valueResolver', function () {
    $col = Column::make('custom', 'Custom')
        ->value(fn ($m) => $m->label)
        ->date();

    $model = (object) ['custom' => '2027-03-01', 'label' => 'My Label'];
    expect($col->getValue($model))->toBe('My Label');
});

it('adds link display with route and params', function () {
    $col = Column::make('name', 'Name')->link('servers.show', ['server' => ':id']);
    $arr = $col->toArray();

    expect($arr['displays'][0])
        ->type->toBe('link')
        ->route->toBe('servers.show')
        ->params->toBe(['server' => ':id'])
        ->prefetch->toBeTrue();
});

it('adds link display with prefetch disabled', function () {
    $col = Column::make('name', 'Name')->link('servers.show', ['server' => ':id'], prefetch: false);
    $arr = $col->toArray();

    expect($arr['displays'][0]['prefetch'])->toBeFalse();
});

it('link with use_ziggy false resolves route server-side via display resolver', function () {
    config()->set('inertia-table.use_ziggy', false);

    $col = Column::make('name', 'Name')->link('items.show', ['item' => ':id']);
    $arr = $col->toArray();

    expect($arr['displays'][0])
        ->type->toBe('link')
        ->prefetch->toBeTrue()
        ->and($arr['displays'][0])->toHaveKey('href_key')
        ->and($arr['displays'][0])->not->toHaveKey('route')
        ->and($arr['displays'][0])->not->toHaveKey('params');
});

it('link with use_ziggy true sends route and params (default)', function () {
    config()->set('inertia-table.use_ziggy', true);

    $col = Column::make('name', 'Name')->link('servers.show', ['server' => ':id']);
    $arr = $col->toArray();

    expect($arr['displays'][0])
        ->type->toBe('link')
        ->route->toBe('servers.show')
        ->params->toBe(['server' => ':id'])
        ->and($arr['displays'][0])->not->toHaveKey('href_key');
});

it('adds copyable display', function () {
    $col = Column::make('ip', 'IP')->copyable();
    $arr = $col->toArray();

    expect($arr['displays'][0]['type'])->toBe('copyable');
});

it('withIcon with string prepends icon display', function () {
    $col = Column::make('type', 'Type')->withIcon('server')->text();
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(2)
        ->and($arr['displays'][0]['type'])->toBe('icon')
        ->and($arr['displays'][1]['type'])->toBe('text');
});

it('withIcon with closure resolves icon name', function () {
    $col = Column::make('type', 'Type')->withIcon(fn ($m) => "icon-{$m->type}");
    $arr = $col->toArray();

    expect($arr['displays'][0]['type'])->toBe('icon')
        ->and($arr['displays'][0])->toHaveKey('key');
});

it('asIcon with string creates icon-only display', function () {
    $col = Column::make('type', 'Type')->asIcon('server');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('icon');
});

it('adds component display', function () {
    $col = Column::make('actions', 'Actions')->component('ServerActions');
    $arr = $col->toArray();

    expect($arr['displays'][0])
        ->type->toBe('component')
        ->component->toBe('ServerActions');
});

it('adds enum display with badge and color resolver', function () {
    $col = Column::make('status', 'Status')->enum();
    $arr = $col->toArray();

    expect($arr['displays'][0])
        ->type->toBe('badge')
        ->color_field->toBe('_status_enum_color');
});

it('enum resolves getText from HasTableDisplay', function () {
    $enum = new class implements HasTableDisplay
    {
        public function getText(): string
        {
            return 'Active';
        }

        public function getColor(): string
        {
            return 'success';
        }
    };

    $col = Column::make('status', 'Status')->enum();

    $model = (object) ['status' => $enum];
    expect($col->getValue($model))->toBe('Active');

    $displayValues = $col->resolveDisplayValues($model);
    expect($displayValues['_status_enum_color'])->toBe('success');
});

it('enum falls back for non-HasTableDisplay values', function () {
    $col = Column::make('status', 'Status')->enum();

    $model = (object) ['status' => 'raw_string'];
    expect($col->getValue($model))->toBe('raw_string');

    $displayValues = $col->resolveDisplayValues($model);
    expect($displayValues['_status_enum_color'])->toBeNull();
});

it('chains multiple display modifiers', function () {
    $col = Column::make('name', 'Name')->withIcon('user')->text();
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(2)
        ->and($arr['displays'][0]['type'])->toBe('icon')
        ->and($arr['displays'][1]['type'])->toBe('text');
});

it('generates unique auto-keys for multiple closure displays', function () {
    $col = Column::make('name', 'Name')
        ->text(fn ($m) => 'a')
        ->badge(fn ($m) => 'b');

    $arr = $col->toArray();

    expect($arr['displays'][0]['key'])->toBe('_name_d0_key')
        ->and($arr['displays'][1]['key'])->toBe('_name_d1_key');
});

it('serialises to correct DynamicColumnDef shape', function () {
    $col = Column::make('name', 'Name')->sortable()->text();
    $arr = $col->toArray();

    expect($arr)->toHaveKeys(['name', 'header', 'sortable', 'sort_key', 'hidden', 'displays'])
        ->and($arr['name'])->toBe('name')
        ->and($arr['header'])->toBe('Name')
        ->and($arr['sortable'])->toBeTrue()
        ->and($arr['sort_key'])->toBe('name')
        ->and($arr['hidden'])->toBeFalse()
        ->and($arr['displays'])->toHaveCount(1);
});

it('adjust() transforms value with custom closure', function () {
    $col = Column::make('name', 'Name')->adjust(fn ($v) => strrev($v));

    $model = (object) ['name' => 'hello'];
    expect($col->getValue($model))->toBe('olleh');
});

it('adjust() chains multiple adjusters in order', function () {
    $col = Column::make('name', 'Name')
        ->adjust(fn ($v) => trim($v))
        ->uppercase();

    $model = (object) ['name' => '  hello  '];
    expect($col->getValue($model))->toBe('HELLO');
});

it('uppercase() transforms value', function () {
    $col = Column::make('name', 'Name')->uppercase();

    $model = (object) ['name' => 'hello'];
    expect($col->getValue($model))->toBe('HELLO');
});

it('lowercase() transforms value', function () {
    $col = Column::make('name', 'Name')->lowercase();

    $model = (object) ['name' => 'HELLO'];
    expect($col->getValue($model))->toBe('hello');
});

it('ucFirst() transforms value', function () {
    $col = Column::make('name', 'Name')->ucFirst();

    $model = (object) ['name' => 'hello world'];
    expect($col->getValue($model))->toBe('Hello world');
});

it('ucWords() transforms value', function () {
    $col = Column::make('name', 'Name')->ucWords();

    $model = (object) ['name' => 'hello world'];
    expect($col->getValue($model))->toBe('Hello World');
});

it('adjust() passes null through convenience methods unchanged', function () {
    $col = Column::make('name', 'Name')->uppercase();

    $model = (object) ['name' => null];
    expect($col->getValue($model))->toBeNull();
});

it('adjust() allows custom null handling', function () {
    $col = Column::make('name', 'Name')->adjust(fn ($v) => $v ?? 'N/A');

    $model = (object) ['name' => null];
    expect($col->getValue($model))->toBe('N/A');
});

it('fallback() replaces null with default value', function () {
    $col = Column::make('name', 'Name')->fallback();

    $model = (object) ['name' => null];
    expect($col->getValue($model))->toBe('N/A');
});

it('fallback() replaces null with custom value', function () {
    $col = Column::make('name', 'Name')->fallback('Unknown');

    $model = (object) ['name' => null];
    expect($col->getValue($model))->toBe('Unknown');
});

it('fallback() passes non-null values through', function () {
    $col = Column::make('name', 'Name')->fallback('Unknown');

    $model = (object) ['name' => 'John'];
    expect($col->getValue($model))->toBe('John');
});

it('adjust() works with value() resolver', function () {
    $col = Column::make('name', 'Name')
        ->value(fn ($m) => $m->first.' '.$m->last)
        ->uppercase();

    $model = (object) ['first' => 'John', 'last' => 'Doe'];
    expect($col->getValue($model))->toBe('JOHN DOE');
});

it('adjust() ignores non-string values in convenience methods', function () {
    $col = Column::make('count', 'Count')->uppercase();

    $model = (object) ['count' => 42];
    expect($col->getValue($model))->toBe(42);
});

it('resolves display values from closures', function () {
    $col = Column::make('name', 'Name')->text(fn ($m) => strtoupper($m->name));

    $model = (object) ['name' => 'test'];
    $values = $col->resolveDisplayValues($model);

    expect($values)->toHaveKey('_name_d0_key')
        ->and($values['_name_d0_key'])->toBe('TEST');
});

it('dot-notation name auto-sets accessor and aliases name with prefix', function () {
    $col = Column::make('owner.name', 'Owner');

    expect($col->getName())->toBe('_owner_name')
        ->and($col->getAccessor())->toBe('owner.name')
        ->and($col->getSortKey())->toBe('owner.name');
});

it('dot-notation resolves value through nested object', function () {
    $col = Column::make('owner.name', 'Owner');

    $model = (object) ['owner' => (object) ['name' => 'John']];
    expect($col->getValue($model))->toBe('John');
});

it('dot-notation serialises with aliased name and dot sort_key', function () {
    $col = Column::make('owner.name', 'Owner')->sortable();
    $arr = $col->toArray();

    expect($arr['name'])->toBe('_owner_name')
        ->and($arr['sort_key'])->toBe('owner.name')
        ->and($arr['header'])->toBe('Owner')
        ->and($arr['sortable'])->toBeTrue();
});

it('dot-notation display auto-key uses aliased name', function () {
    $col = Column::make('owner.name', 'Owner')->text(fn ($m) => 'test');

    $model = (object) ['owner' => (object) ['name' => 'John']];
    $values = $col->resolveDisplayValues($model);

    expect($values)->toHaveKey('__owner_name_d0_key')
        ->and($values['__owner_name_d0_key'])->toBe('test');
});

it('dot-notation enum generates correct color key', function () {
    $col = Column::make('owner.status', 'Status')->enum();
    $arr = $col->toArray();

    $badgeDisplay = collect($arr['displays'])->firstWhere('type', 'badge');
    expect($badgeDisplay['color_field'])->toBe('__owner_status_enum_color');
});

it('explicit accessor overrides dot-notation', function () {
    $col = Column::make('owner.name', 'Owner')->accessor('custom_field');

    expect($col->getName())->toBe('_owner_name')
        ->and($col->getAccessor())->toBe('custom_field')
        ->and($col->getSortKey())->toBe('custom_field');
});

it('multi-level dot-notation works', function () {
    $col = Column::make('owner.address.city', 'City');

    expect($col->getName())->toBe('_owner_address_city')
        ->and($col->getAccessor())->toBe('owner.address.city');

    $model = (object) ['owner' => (object) ['address' => (object) ['city' => 'London']]];
    expect($col->getValue($model))->toBe('London');
});

it('data() factory supports dot-notation', function () {
    $col = Column::data('owner.name');

    expect($col->getName())->toBe('_owner_name')
        ->and($col->getAccessor())->toBe('owner.name')
        ->and($col->isHidden())->toBeTrue();
});

it('name without dots is unchanged', function () {
    $col = Column::make('simple_name', 'Simple');

    expect($col->getName())->toBe('simple_name')
        ->and($col->getAccessor())->toBe('simple_name');
});
