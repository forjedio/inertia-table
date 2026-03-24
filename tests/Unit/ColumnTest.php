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

it('adds date display', function () {
    $col = Column::make('created_at', 'Created')->date();
    $arr = $col->toArray();

    expect($arr['displays'][0]['type'])->toBe('date');
});

it('adds date display with format', function () {
    $col = Column::make('created_at', 'Created')->date(format: 'DD/MM/YYYY');
    $arr = $col->toArray();

    expect($arr['displays'][0]['format'])->toBe('DD/MM/YYYY');
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

it('resolves display values from closures', function () {
    $col = Column::make('name', 'Name')->text(fn ($m) => strtoupper($m->name));

    $model = (object) ['name' => 'test'];
    $values = $col->resolveDisplayValues($model);

    expect($values)->toHaveKey('_name_d0_key')
        ->and($values['_name_d0_key'])->toBe('TEST');
});
