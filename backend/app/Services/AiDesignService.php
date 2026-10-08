<?php

namespace App\Services;

use App\Services\Ai\AiProviderInterface;
use RuntimeException;

class AiDesignService
{
    public function __construct(private readonly AiProviderInterface $provider) {}

    public function generateDesign(array $input): array
    {
        return $this->normalizeDesign($this->provider->generateDesign($input));
    }

    public function generateContent(array $input): array
    {
        return $this->provider->generateContent($input);
    }

    public function generateImage(string $prompt): string
    {
        return $this->provider->generateImage($prompt);
    }

    private function normalizeDesign(array $data): array
    {
        foreach (['title', 'bio', 'theme', 'primary_color', 'secondary_color', 'button_style', 'recommended_links', 'cover_prompt'] as $key) {
            if (! array_key_exists($key, $data)) {
                throw new RuntimeException('AI returned an incomplete design suggestion.');
            }
        }

        return [
            'title' => (string) $data['title'],
            'bio' => (string) $data['bio'],
            'business_description' => (string) ($data['business_description'] ?? ''),
            'theme' => $this->theme((string) $data['theme']),
            'primary_color' => $this->color((string) $data['primary_color'], '#D4AF37'),
            'secondary_color' => $this->color((string) $data['secondary_color'], '#0B0F19'),
            'background_color' => $this->color((string) ($data['background_color'] ?? '#05070D'), '#05070D'),
            'button_style' => (string) $data['button_style'],
            'recommended_links' => $this->links($data['recommended_links']),
            'cover_prompt' => (string) $data['cover_prompt'],
            'profile_image_style' => (string) ($data['profile_image_style'] ?? ''),
            'menu_or_catalogue_ideas' => array_values(array_filter(array_map('strval', (array) ($data['menu_or_catalogue_ideas'] ?? [])))),
        ];
    }

    private function theme(string $theme): string
    {
        $allowed = ['black-gold', 'minimal-white', 'modern-dark', 'moroccan', 'business'];

        return in_array($theme, $allowed, true) ? $theme : 'business';
    }

    private function color(string $value, string $fallback): string
    {
        return preg_match('/^#[0-9A-Fa-f]{6}$/', $value) ? strtoupper($value) : $fallback;
    }

    private function links(mixed $links): array
    {
        return collect((array) $links)
            ->filter(fn ($link) => is_array($link) && ! empty($link['type']) && ! empty($link['title']))
            ->map(fn ($link) => [
                'type' => (string) $link['type'],
                'title' => (string) $link['title'],
            ])
            ->values()
            ->all();
    }
}
