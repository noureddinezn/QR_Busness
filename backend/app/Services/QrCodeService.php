<?php

namespace App\Services;

use App\Models\Link;
use App\Models\Page;
use App\Models\QrCode;

class QrCodeService
{
    public function mainForPage(Page $page): QrCode
    {
        return QrCode::updateOrCreate(
            ['page_id' => $page->id, 'link_id' => null, 'type' => 'main'],
            ['target_url' => $this->publicPageUrl($page), 'format' => 'dynamic']
        );
    }

    public function dedicatedForLink(Link $link): QrCode
    {
        return QrCode::updateOrCreate(
            ['page_id' => $link->page_id, 'link_id' => $link->id, 'type' => $link->type],
            ['target_url' => $this->normaliseTarget($link), 'format' => 'dynamic']
        );
    }

    public function allForPage(Page $page): array
    {
        $page->load('links');
        $records = [$this->mainForPage($page)];

        foreach ($page->links as $link) {
            if ($this->supportsDedicatedQr($link->type)) {
                $records[] = $this->dedicatedForLink($link);
            }
        }

        return $records;
    }

    public function publicPageUrl(Page $page): string
    {
        $frontend = rtrim((string) config('app.frontend_url'), '/');

        return "{$frontend}/p/{$page->slug}";
    }

    public function normaliseTarget(Link $link): string
    {
        return match ($link->type) {
            'phone' => str_starts_with($link->url, 'tel:') ? $link->url : 'tel:'.$link->url,
            'email' => str_starts_with($link->url, 'mailto:') ? $link->url : 'mailto:'.$link->url,
            'whatsapp' => $this->whatsappUrl($link->url),
            default => $link->url,
        };
    }

    private function supportsDedicatedQr(string $type): bool
    {
        return in_array($type, ['maps', 'whatsapp', 'review', 'website', 'phone', 'custom'], true);
    }

    private function whatsappUrl(string $value): string
    {
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        $phone = preg_replace('/\D+/', '', $value);

        return "https://wa.me/{$phone}";
    }
}
