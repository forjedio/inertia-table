<?php

namespace Forjed\InertiaTable;

use Forjed\InertiaTable\Commands\MakeTableCommand;
use Illuminate\Support\ServiceProvider;

class TableServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/inertia-table.php',
            'inertia-table'
        );

        $this->app->scoped(HookRegistry::class);
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/inertia-table.php' => config_path('inertia-table.php'),
            ], 'inertia-table-config');

            $this->commands([
                MakeTableCommand::class,
            ]);
        }
    }
}
