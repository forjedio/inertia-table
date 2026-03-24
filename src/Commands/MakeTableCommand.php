<?php

namespace Forjed\InertiaTable\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use ReflectionClass;

class MakeTableCommand extends Command
{
    protected $signature = 'make:table {name : The name of the table class (e.g. ServerTable or Servers/SiteTable)} {--model= : The Eloquent model class}';

    protected $description = 'Create a new table class';

    public function handle(): int
    {
        $name = $this->argument('name');
        $modelOption = $this->option('model');

        // Support nested paths like Servers/SiteTable
        $name = str_replace('\\', '/', $name);
        $segments = explode('/', $name);
        $className = Str::studly(array_pop($segments));
        $subPath = implode('/', array_map(fn ($s) => Str::studly($s), $segments));

        $basePath = config('inertia-table.table_path', 'Tables');
        $basePath = str_replace('\\', '/', $basePath);

        $namespace = 'App\\'.str_replace('/', '\\', $basePath);
        $directory = app_path($basePath);

        if ($subPath) {
            $namespace .= '\\'.str_replace('/', '\\', $subPath);
            $directory .= '/'.$subPath;
        }

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $filePath = $directory.'/'.$className.'.php';

        if (file_exists($filePath)) {
            $this->error("Table class [{$className}] already exists at {$filePath}");

            return self::FAILURE;
        }

        $stub = file_get_contents(__DIR__.'/../../stubs/table.stub');

        $modelImport = '';
        $columns = '// TODO: Define your columns here';

        if ($modelOption) {
            $modelClass = $this->resolveModelClass($modelOption);
            $modelImport = "use {$modelClass};";
            $columns = $this->generateColumnsFromModel($modelClass);
        }

        $stub = str_replace(
            ['{{ namespace }}', '{{ class }}', '{{ model_import }}', '{{ columns }}'],
            [$namespace, $className, $modelImport, $columns],
            $stub
        );

        file_put_contents($filePath, $stub);

        $this->info("Table class [{$className}] created successfully.");
        $this->line("  <comment>Path:</comment> {$filePath}");
        $this->line("  <comment>Namespace:</comment> {$namespace}\\{$className}");

        return self::SUCCESS;
    }

    protected function resolveModelClass(string $model): string
    {
        if (class_exists($model)) {
            return $model;
        }

        $withNamespace = 'App\\Models\\'.Str::studly($model);

        if (class_exists($withNamespace)) {
            return $withNamespace;
        }

        return $withNamespace;
    }

    protected function generateColumnsFromModel(string $modelClass): string
    {
        if (! class_exists($modelClass)) {
            return '// TODO: Define your columns here';
        }

        try {
            $reflection = new ReflectionClass($modelClass);
            $fillableProperty = $reflection->getProperty('fillable');
            $fillableProperty->setAccessible(true);

            $instance = $reflection->newInstanceWithoutConstructor();
            $fillable = $fillableProperty->getValue($instance);

            if (empty($fillable)) {
                return '// TODO: Define your columns here';
            }

            $lines = [];
            foreach ($fillable as $field) {
                $header = Str::headline($field);
                $lines[] = "Column::make('{$field}', '{$header}')";
            }

            return implode(",\n            ", $lines).',';
        } catch (\Throwable) {
            return '// TODO: Define your columns here';
        }
    }
}
