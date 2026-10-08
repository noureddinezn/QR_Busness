<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AiDesignControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_generate_design_suggestions(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/ai/design', [
            'business_type' => 'Phone Store',
            'business_name' => 'TechZone',
            'description' => 'Smartphones, accessories and repair',
            'style' => 'Black Gold',
            'mood' => 'Premium',
            'language' => 'French',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.title', 'TechZone')
            ->assertJsonStructure([
                'data' => [
                    'title',
                    'bio',
                    'theme',
                    'primary_color',
                    'secondary_color',
                    'recommended_links',
                    'cover_prompt',
                    'menu_or_catalogue_ideas',
                ],
            ]);
    }

    public function test_design_request_validation_blocks_missing_fields(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/ai/design', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['business_type', 'business_name', 'description', 'style', 'mood', 'language']);
    }

    public function test_ai_routes_require_authentication(): void
    {
        $this->postJson('/api/ai/design', [])->assertUnauthorized();
    }
}
