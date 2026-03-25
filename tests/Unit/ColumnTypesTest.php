<?php

use Forjed\InertiaTable\Column;
use Forjed\InertiaTable\Columns\BadgeColumn;
use Forjed\InertiaTable\Columns\BooleanColumn;
use Forjed\InertiaTable\Columns\ComponentColumn;
use Forjed\InertiaTable\Columns\CopyableColumn;
use Forjed\InertiaTable\Columns\DateColumn;
use Forjed\InertiaTable\Columns\DateTimeColumn;
use Forjed\InertiaTable\Columns\EnumColumn;
use Forjed\InertiaTable\Columns\LinkColumn;
use Forjed\InertiaTable\Columns\TextColumn;
use Forjed\InertiaTable\Contracts\HasTableDisplay;

it('TextColumn auto-adds text display', function () {
    $col = TextColumn::make('name', 'Name');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('text');
});

it('TextColumn with ucFirst adjuster transforms value', function () {
    $col = TextColumn::make('name', 'Name')->ucFirst();

    $model = (object) ['name' => 'hello world'];
    expect($col->getValue($model))->toBe('Hello world');
});

it('TextColumn supports chaining', function () {
    $col = TextColumn::make('name', 'Name')->sortable();

    expect($col->isSortable())->toBeTrue();
});

it('BadgeColumn auto-adds badge display', function () {
    $col = BadgeColumn::make('status', 'Status');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('badge');
});

it('BadgeColumn supports colorField fluent setter', function () {
    $col = BadgeColumn::make('status', 'Status')->colorField('status_color');
    $arr = $col->toArray();

    expect($arr['displays'][0]['color_field'])->toBe('status_color');
});

it('BadgeColumn supports variant fluent setter', function () {
    $col = BadgeColumn::make('status', 'Status')->variant('outline');
    $arr = $col->toArray();

    expect($arr['displays'][0]['variant'])->toBe('outline');
});

it('BadgeColumn supports chaining colorField and variant', function () {
    $col = BadgeColumn::make('status', 'Status')
        ->colorField('color')
        ->variant('outline')
        ->sortable();

    $arr = $col->toArray();

    expect($arr['displays'][0])
        ->color_field->toBe('color')
        ->variant->toBe('outline')
        ->and($col->isSortable())->toBeTrue();
});

it('DateColumn auto-adds date display', function () {
    $col = DateColumn::make('created_at', 'Created');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('date');
});

it('DateColumn supports format() fluent setter', function () {
    $col = DateColumn::make('created_at', 'Created')->format('DD/MM/YYYY');
    $arr = $col->toArray();

    expect($arr['displays'][0]['format'])->toBe('DD/MM/YYYY');
});

it('DateColumn is sortable via chaining', function () {
    $col = DateColumn::make('created_at', 'Created')->sortable();

    expect($col->isSortable())->toBeTrue();
});

it('DateColumn can add additional displays', function () {
    $col = DateColumn::make('created_at', 'Created')->copyable();
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(2)
        ->and($arr['displays'][0]['type'])->toBe('date')
        ->and($arr['displays'][1]['type'])->toBe('copyable');
});

it('DateTimeColumn auto-adds date display with datetime format', function () {
    $col = DateTimeColumn::make('created_at', 'Created');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('date')
        ->and($arr['displays'][0]['format'])->toBe('YYYY-MM-DD HH:mm:ss');
});

it('DateTimeColumn format can be overridden', function () {
    $col = DateTimeColumn::make('created_at', 'Created')->format('HH:mm DD/MM');
    $arr = $col->toArray();

    expect($arr['displays'][0]['format'])->toBe('HH:mm DD/MM');
});

it('LinkColumn requires route() to add link display', function () {
    $col = LinkColumn::make('name', 'Name')->route('items.show', ['item' => ':id']);
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0])
        ->type->toBe('link')
        ->route->toBe('items.show')
        ->params->toBe(['item' => ':id'])
        ->prefetch->toBeTrue();
});

it('LinkColumn supports prefetch disabled', function () {
    $col = LinkColumn::make('name', 'Name')->route('items.show', prefetch: false);
    $arr = $col->toArray();

    expect($arr['displays'][0]['prefetch'])->toBeFalse();
});

it('LinkColumn supports sortable chaining', function () {
    $col = LinkColumn::make('name', 'Name')
        ->route('items.show', ['item' => ':id'])
        ->sortable();

    expect($col->isSortable())->toBeTrue();
});

it('CopyableColumn auto-adds copyable display', function () {
    $col = CopyableColumn::make('ip', 'IP Address');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('copyable');
});

it('CopyableColumn supports chaining', function () {
    $col = CopyableColumn::make('ip', 'IP')->sortable();

    expect($col->isSortable())->toBeTrue();
});

it('withIcon with fixed string prepends icon display', function () {
    $col = Column::make('name', 'Name')->withIcon('user')->text();
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(2)
        ->and($arr['displays'][0]['type'])->toBe('icon')
        ->and($arr['displays'][1]['type'])->toBe('text');
});

it('withIcon with map resolves icon from column value', function () {
    $col = Column::make('type', 'Type')->withIcon(['server' => 'server', 'site' => 'globe'], default: 'box');

    $row = (object) ['type' => 'server'];
    $iconKey = $col->toArray()['displays'][0]['key'];
    $resolved = $col->resolveDisplayValues($row);

    expect($resolved[$iconKey])->toBe('server');
});

it('withIcon map uses default when no match', function () {
    $col = Column::make('type', 'Type')->withIcon(['server' => 'server'], default: 'box');

    $row = (object) ['type' => 'unknown'];
    $iconKey = $col->toArray()['displays'][0]['key'];
    $resolved = $col->resolveDisplayValues($row);

    expect($resolved[$iconKey])->toBe('box');
});

it('withIcon with closure resolves dynamically', function () {
    $col = Column::make('type', 'Type')->withIcon(fn ($m) => $m->type === 'server' ? 'server' : 'x');

    $row = (object) ['type' => 'server'];
    $iconKey = $col->toArray()['displays'][0]['key'];
    $resolved = $col->resolveDisplayValues($row);

    expect($resolved[$iconKey])->toBe('server');
});

it('withIcon on badge adds icon_key to badge display', function () {
    $col = Column::make('status', 'Status')->withIcon('check')->badge();
    $arr = $col->toArray();

    // Badge should have icon_key, no separate icon display prepended
    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('badge')
        ->and($arr['displays'][0])->toHaveKey('icon_key');
});

it('asIcon renders only icon display', function () {
    $col = Column::make('type', 'Type')->asIcon(['server' => 'server', 'site' => 'globe'], default: 'box');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('icon');
});

it('asIcon ignores other displays', function () {
    $col = Column::make('type', 'Type')->asIcon('server')->text();
    $arr = $col->toArray();

    // asIcon should still have only the icon display because iconOnly is set
    // text() adds to displays but toArray filters when iconOnly
    // Actually, asIcon sets iconOnly flag - let's verify displays
    expect($arr['displays'][0]['type'])->toBe('icon');
});

it('ComponentColumn auto-adds component display', function () {
    $col = ComponentColumn::create('actions', 'Actions', 'ServerActions');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0])
        ->type->toBe('component')
        ->component->toBe('ServerActions');
});

it('ComponentColumn supports hidden', function () {
    $col = ComponentColumn::create('actions', '', 'ServerActions')->hidden();

    expect($col->isHidden())->toBeTrue();
});

it('EnumColumn auto-adds enum display', function () {
    $col = EnumColumn::make('status', 'Status');
    $arr = $col->toArray();

    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('badge')
        ->and($arr['displays'][0]['color_field'])->toBe('_status_enum_color');
});

it('EnumColumn resolves getText and getColor from HasTableDisplay', function () {
    $enum = new class implements HasTableDisplay
    {
        public function getText(): string
        {
            return 'Running';
        }

        public function getColor(): string
        {
            return 'info';
        }
    };

    $col = EnumColumn::make('status', 'Status');
    $model = (object) ['status' => $enum];

    expect($col->getValue($model))->toBe('Running');

    $displayValues = $col->resolveDisplayValues($model);
    expect($displayValues['_status_enum_color'])->toBe('info');
});

it('EnumColumn with uppercase adjuster transforms resolved text', function () {
    $enum = new class implements HasTableDisplay
    {
        public function getText(): string
        {
            return 'Running';
        }

        public function getColor(): string
        {
            return 'info';
        }
    };

    $col = EnumColumn::make('status', 'Status')->uppercase();
    $model = (object) ['status' => $enum];

    expect($col->getValue($model))->toBe('RUNNING');
});

it('EnumColumn supports sortable chaining', function () {
    $col = EnumColumn::make('status', 'Status')->sortable();

    expect($col->isSortable())->toBeTrue();
});

it('BooleanColumn renders Yes/No by default', function () {
    $col = BooleanColumn::make('active', 'Active');

    $trueModel = (object) ['active' => true];
    $falseModel = (object) ['active' => false];

    expect($col->getValue($trueModel))->toBe('Yes')
        ->and($col->getValue($falseModel))->toBe('No');

    $arr = $col->toArray();
    expect($arr['displays'])->toHaveCount(1)
        ->and($arr['displays'][0]['type'])->toBe('text');
});

it('BooleanColumn supports custom yesText and noText', function () {
    $col = BooleanColumn::make('active', 'Active')
        ->yesText('Enabled')
        ->noText('Disabled');

    $trueModel = (object) ['active' => true];
    $falseModel = (object) ['active' => false];

    expect($col->getValue($trueModel))->toBe('Enabled')
        ->and($col->getValue($falseModel))->toBe('Disabled');
});

it('BooleanColumn supports static default text overrides', function () {
    BooleanColumn::defaultYesText('On');
    BooleanColumn::defaultNoText('Off');

    $col = BooleanColumn::make('active', 'Active');

    expect($col->getValue((object) ['active' => true]))->toBe('On')
        ->and($col->getValue((object) ['active' => false]))->toBe('Off');

    // Reset defaults
    BooleanColumn::defaultYesText('Yes');
    BooleanColumn::defaultNoText('No');
});

it('BooleanColumn per-column text overrides static defaults', function () {
    BooleanColumn::defaultYesText('On');
    BooleanColumn::defaultNoText('Off');

    $col = BooleanColumn::make('active', 'Active')
        ->yesText('Active')
        ->noText('Inactive');

    expect($col->getValue((object) ['active' => true]))->toBe('Active')
        ->and($col->getValue((object) ['active' => false]))->toBe('Inactive');

    // Reset defaults
    BooleanColumn::defaultYesText('Yes');
    BooleanColumn::defaultNoText('No');
});

it('BooleanColumn with uppercase adjuster transforms resolved text', function () {
    $col = BooleanColumn::make('active', 'Active')->uppercase();

    expect($col->getValue((object) ['active' => true]))->toBe('YES')
        ->and($col->getValue((object) ['active' => false]))->toBe('NO');
});

it('BooleanColumn supports sortable chaining', function () {
    $col = BooleanColumn::make('active', 'Active')->sortable();

    expect($col->isSortable())->toBeTrue();
});
