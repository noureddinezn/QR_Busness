<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PageDesignTest extends TestCase
{
    use RefreshDatabase;

    public function test_design_is_saved_and_returned_on_the_public_profile(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $page = $this->postJson('/api/pages', [
            'title' => 'Design Studio', 'slug' => 'design-studio',
            'theme' => 'black-gold', 'background_color' => '#123456',
            'button_style' => 'rounded', 'is_active' => true,
        ])->assertCreated()->json('data');

        $this->getJson('/api/public/pages/design-studio')->assertOk()
            ->assertJsonPath('data.background_color', '#123456')
            ->assertJsonPath('data.button_style', 'rounded');
        $this->putJson('/api/pages/'.$page['id'], [
            'background_color' => '#FFFFFF', 'button_style' => 'square',
        ])->assertOk();
        $this->assertDatabaseHas('pages', [
            'id' => $page['id'], 'background_color' => '#FFFFFF', 'button_style' => 'square',
        ]);
    }

    public function test_invalid_design_values_are_rejected(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/pages', [
            'title' => 'Test', 'slug' => 'test', 'theme' => 'business',
            'background_color' => 'invalid', 'button_style' => 'invalid',
        ])->assertUnprocessable()->assertJsonValidationErrors(['background_color', 'button_style']);
    }
}
