<?php

namespace App\Services\Ai;

class LocalAiProvider implements AiProviderInterface
{
    public function generateDesign(array $input): array
    {
        $businessName = trim((string) ($input['business_name'] ?? 'Digital Profile')) ?: 'Digital Profile';
        $businessType = trim((string) ($input['business_type'] ?? 'Business')) ?: 'Business';
        $description = trim((string) ($input['description'] ?? '')) ?: "Professional {$businessType}";
        $style = strtolower((string) ($input['style'] ?? 'business'));
        $mood = strtolower((string) ($input['mood'] ?? 'premium'));
        $preset = $this->themePreset($style, $mood);

        return [
            'title' => $businessName,
            'bio' => $this->bio($businessType, $description, (string) ($input['language'] ?? 'English')),
            'business_description' => $description,
            'theme' => $preset['theme'],
            'primary_color' => $preset['primary_color'],
            'secondary_color' => $preset['secondary_color'],
            'background_color' => $preset['background_color'],
            'button_style' => $preset['button_style'],
            'recommended_links' => $this->linksFor($businessType),
            'cover_prompt' => "Professional {$mood} {$businessType} visual for {$businessName}, {$style} style, polished lighting, modern digital profile cover, high-end product photography",
            'profile_image_style' => "Clean centered logo or avatar with {$preset['primary_color']} accent and simple background.",
            'menu_or_catalogue_ideas' => $this->catalogueIdeas($businessType),
        ];
    }

    public function generateContent(array $input): array
    {
        $subject = strtolower((string) ($input['prompt'] ?? 'business catalogue'));

        if (str_contains($subject, 'restaurant') || str_contains($subject, 'menu')) {
            return [
                'categories' => [
                    ['name' => 'Signature Dishes', 'items' => [
                        ['name' => 'House Special', 'description' => 'A highlighted item with premium presentation.', 'price' => 'Price on request'],
                    ]],
                    ['name' => 'Drinks', 'items' => [
                        ['name' => 'Fresh Selection', 'description' => 'Refreshing drinks selected for your guests.', 'price' => 'Price on request'],
                    ]],
                ],
                'cta' => 'Order or reserve now',
            ];
        }

        return [
            'categories' => [
                ['name' => 'Products', 'items' => [
                    ['name' => 'Featured Products', 'description' => 'Showcase your best-selling offers.', 'price' => 'Price on request'],
                ]],
                ['name' => 'Services', 'items' => [
                    ['name' => 'Professional Service', 'description' => 'Explain the service and invite customers to contact you.', 'price' => 'Price on request'],
                ]],
            ],
            'cta' => 'Contact us today',
        ];
    }

    public function generateImage(string $prompt): string
    {
        return '';
    }

    private function themePreset(string $style, string $mood): array
    {
        if (str_contains($style, 'moroccan') || str_contains($mood, 'traditional')) {
            return ['theme' => 'moroccan', 'primary_color' => '#D97706', 'secondary_color' => '#064E3B', 'background_color' => '#071A16', 'button_style' => 'rounded'];
        }

        if (str_contains($style, 'dark') || str_contains($style, 'tech')) {
            return ['theme' => 'modern-dark', 'primary_color' => '#22D3EE', 'secondary_color' => '#0F172A', 'background_color' => '#020617', 'button_style' => 'rounded'];
        }

        if (str_contains($style, 'white') || str_contains($mood, 'minimal')) {
            return ['theme' => 'minimal-white', 'primary_color' => '#111827', 'secondary_color' => '#E5E7EB', 'background_color' => '#FFFFFF', 'button_style' => 'pill'];
        }

        if (str_contains($style, 'gold') || str_contains($style, 'luxury') || str_contains($mood, 'premium')) {
            return ['theme' => 'black-gold', 'primary_color' => '#D4AF37', 'secondary_color' => '#0B0F19', 'background_color' => '#05070D', 'button_style' => 'rounded'];
        }

        return ['theme' => 'business', 'primary_color' => '#2563EB', 'secondary_color' => '#0F172A', 'background_color' => '#F8FAFC', 'button_style' => 'rounded'];
    }

    private function bio(string $businessType, string $description, string $language): string
    {
        if (strtolower($language) === 'french') {
            return "Découvrez {$description}. Une présence digitale moderne pour {$businessType}, avec accès rapide aux liens essentiels.";
        }

        return "{$description}. A polished digital profile for your {$businessType}, with quick access to every important link.";
    }

    private function linksFor(string $businessType): array
    {
        $type = strtolower($businessType);
        $links = [
            ['type' => 'whatsapp', 'title' => 'Contact on WhatsApp'],
            ['type' => 'instagram', 'title' => 'View Instagram'],
            ['type' => 'maps', 'title' => 'Find Us'],
        ];

        if (str_contains($type, 'developer') || str_contains($type, 'freelance')) {
            $links[] = ['type' => 'github', 'title' => 'View GitHub'];
            $links[] = ['type' => 'linkedin', 'title' => 'Connect on LinkedIn'];
        } else {
            $links[] = ['type' => 'website', 'title' => 'Visit Website'];
            $links[] = ['type' => 'review', 'title' => 'Leave a Review'];
        }

        return $links;
    }

    private function catalogueIdeas(string $businessType): array
    {
        $type = strtolower($businessType);

        if (str_contains($type, 'phone') || str_contains($type, 'tech')) {
            return ['Smartphones', 'Accessories', 'Repair Services', 'Special Offers'];
        }

        if (str_contains($type, 'restaurant') || str_contains($type, 'cafe')) {
            return ['Signature Menu', 'Drinks', 'Daily Offers', 'Reservations'];
        }

        if (str_contains($type, 'barber')) {
            return ['Haircuts', 'Beard Care', 'Booking', 'Premium Packages'];
        }

        return ['Services', 'Products', 'Portfolio', 'Contact Options'];
    }
}
