<?php

namespace App\Services\Ai;

interface AiProviderInterface
{
    public function generateDesign(array $input): array;

    public function generateContent(array $input): array;

    public function generateImage(string $prompt): string;
}
