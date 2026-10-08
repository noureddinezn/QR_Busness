<?php

return [
    'provider' => env('AI_PROVIDER', 'local'),
    'api_key' => env('AI_API_KEY'),
    'model' => env('AI_MODEL', 'gpt-4o-mini'),
    'timeout' => (int) env('AI_TIMEOUT', 20),
];
