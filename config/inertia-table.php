<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Per-Page
    |--------------------------------------------------------------------------
    | Default number of rows per page. Can be overridden per-table via the
    | $perPage property or the perPage() fluent setter.
    */
    'per_page' => 10,

    /*
    |--------------------------------------------------------------------------
    | Date Format
    |--------------------------------------------------------------------------
    | Default date format passed to the frontend for date display cells.
    */
    'date_format' => 'Y-m-d H:i:s',

    /*
    |--------------------------------------------------------------------------
    | Search Debounce (ms)
    |--------------------------------------------------------------------------
    | Frontend search input debounce time in milliseconds.
    | Passed in the serialised response for the frontend to consume.
    */
    'search_debounce' => 300,

    /*
    |--------------------------------------------------------------------------
    | Use Ziggy
    |--------------------------------------------------------------------------
    | When true (default), link columns send route names and parameters to
    | the frontend for Ziggy to resolve client-side. When false, routes are
    | resolved server-side using Laravel's route() helper and pre-built
    | URLs are sent to the frontend instead. Set to false if your project
    | does not use Ziggy.
    */
    'use_ziggy' => true,

    /*
    |--------------------------------------------------------------------------
    | Table Path
    |--------------------------------------------------------------------------
    | The default path within app/ where table classes are generated.
    | This also determines the namespace. For example, 'Http/Tables'
    | would generate classes under App\Http\Tables.
    */
    'table_path' => 'Tables',
];
