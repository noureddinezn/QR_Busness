<?php

namespace Database\Seeders;

use App\Models\Link;
use App\Models\LinkClick;
use App\Models\Page;
use App\Models\Scan;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(['email' => 'admin@example.com'], [
            'name' => 'Admin User',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $user = User::updateOrCreate(['email' => 'demo@example.com'], [
            'name' => 'Demo Owner',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
        ]);

        $page = Page::updateOrCreate(['slug' => 'techzone'], [
            'user_id' => $user->id,
            'title' => 'TechZone',
            'bio' => 'Phone store, accessories, repairs, and fast WhatsApp support.',
            'theme' => 'black-gold',
            'primary_color' => '#d4af37',
            'secondary_color' => '#111827',
            'is_active' => true,
        ]);

        $links = [
            ['type' => 'whatsapp', 'title' => 'WhatsApp', 'url' => '+212600000000', 'icon' => 'fa-brands fa-whatsapp', 'position' => 1],
            ['type' => 'instagram', 'title' => 'Instagram', 'url' => 'https://instagram.com/techzone', 'icon' => 'fa-brands fa-instagram', 'position' => 2],
            ['type' => 'maps', 'title' => 'Find us on Google Maps', 'url' => 'https://maps.google.com', 'icon' => 'fa-solid fa-location-dot', 'position' => 3],
            ['type' => 'website', 'title' => 'Website', 'url' => 'https://example.com', 'icon' => 'fa-solid fa-globe', 'position' => 4],
        ];

        foreach ($links as $data) {
            Link::updateOrCreate(
                ['page_id' => $page->id, 'type' => $data['type'], 'title' => $data['title']],
                $data + ['page_id' => $page->id, 'is_active' => true]
            );
        }

        for ($index = 0; $index < 8; $index++) {
            Scan::create([
                'page_id' => $page->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Seeder',
                'device' => $index % 2 === 0 ? 'Mobile' : 'Desktop',
                'browser' => 'Demo',
                'scanned_at' => now()->subDays($index),
            ]);
        }

        foreach ($page->links as $link) {
            LinkClick::create([
                'link_id' => $link->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Seeder',
                'device' => 'Mobile',
                'browser' => 'Demo',
                'clicked_at' => now()->subHours($link->position),
            ]);
        }
    }
}
