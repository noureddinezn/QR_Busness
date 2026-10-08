<?php

namespace Tests\Unit;

use App\Services\Ai\AiProviderInterface;
use App\Services\AiDesignService;
use RuntimeException;
use Tests\TestCase;

class AiDesignServiceTest extends TestCase
{
    public function test_it_normalizes_valid_design_suggestions(): void
    {
        $service = new AiDesignService(new class implements AiProviderInterface {
            public function generateDesign(array $input): array
            {
                return [
                    'title' => 'TechZone',
                    'bio' => 'Premium phones and repair.',
                    'theme' => 'black-gold',
                    'primary_color' => '#d4af37',
                    'secondary_color' => '#0b0f19',
                    'button_style' => 'rounded',
                    'recommended_links' => [['type' => 'whatsapp', 'title' => 'Order on WhatsApp']],
                    'cover_prompt' => 'Premium phone store cover',
                ];
            }

            public function generateContent(array $input): array
            {
                return [];
            }

            public function generateImage(string $prompt): string
            {
                return '';
            }
        });

        $result = $service->generateDesign([]);

        $this->assertSame('#D4AF37', $result['primary_color']);
        $this->assertSame('black-gold', $result['theme']);
        $this->assertSame('Order on WhatsApp', $result['recommended_links'][0]['title']);
    }

    public function test_it_rejects_incomplete_ai_json(): void
    {
        $service = new AiDesignService(new class implements AiProviderInterface {
            public function generateDesign(array $input): array
            {
                return ['title' => 'Broken'];
            }

            public function generateContent(array $input): array
            {
                return [];
            }

            public function generateImage(string $prompt): string
            {
                return '';
            }
        });

        $this->expectException(RuntimeException::class);

        $service->generateDesign([]);
    }
}
