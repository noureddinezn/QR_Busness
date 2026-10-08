<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiProvider implements AiProviderInterface
{
    public function generateDesign(array $input): array
    {
        return $this->jsonCompletion(
            'You generate structured JSON for a QR digital profile design assistant. Return JSON only.',
            'Create a professional digital profile design suggestion from this input: '.json_encode($input)
        );
    }

    public function generateContent(array $input): array
    {
        return $this->jsonCompletion(
            'You generate structured JSON catalogue/menu ideas. Return JSON only.',
            'Create menu or catalogue content from this request: '.json_encode($input)
        );
    }

    public function generateImage(string $prompt): string
    {
        $key = config('ai.api_key');
        if (! $key) {
            throw new RuntimeException('AI image generation is not configured.');
        }

        $response = Http::withToken($key)
            ->timeout(config('ai.timeout'))
            ->post('https://api.openai.com/v1/images/generations', [
                'model' => 'gpt-image-1',
                'prompt' => $prompt,
                'size' => '1024x1024',
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('AI image generation is temporarily unavailable.');
        }

        return (string) data_get($response->json(), 'data.0.url', '');
    }

    private function jsonCompletion(string $system, string $user): array
    {
        $key = config('ai.api_key');
        if (! $key) {
            throw new RuntimeException('AI generation is not configured.');
        }

        $response = Http::withToken($key)
            ->timeout(config('ai.timeout'))
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => config('ai.model'),
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => $system],
                    ['role' => 'user', 'content' => $user],
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('AI generation is temporarily unavailable.');
        }

        $content = data_get($response->json(), 'choices.0.message.content');
        $decoded = json_decode((string) $content, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('AI returned malformed JSON.');
        }

        return $decoded;
    }
}
