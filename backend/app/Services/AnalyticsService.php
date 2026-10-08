<?php

namespace App\Services;

use App\Models\Link;
use App\Models\LinkClick;
use App\Models\Page;
use App\Models\Scan;
use Illuminate\Http\Request;

class AnalyticsService
{
    public function recordScan(Page $page, Request $request): Scan
    {
        return $page->scans()->create($this->requestMeta($request) + [
            'scanned_at' => now(),
        ]);
    }

    public function recordLinkClick(Link $link, Request $request): LinkClick
    {
        return $link->clicks()->create($this->requestMeta($request) + [
            'clicked_at' => now(),
        ]);
    }

    public function pageSummary(Page $page): array
    {
        $page->loadCount(['scans', 'links']);

        $totalClicks = LinkClick::whereHas(
            'link',
            fn ($query) => $query->where('page_id', $page->id)
        )->count();

        return [
            'total_page_views' => $page->scans_count,
            'total_qr_scans' => $page->scans_count,
            'total_link_clicks' => $totalClicks,
            'total_links' => $page->links_count,
            'most_clicked_links' => $page->links()
                ->withCount('clicks')
                ->orderByDesc('clicks_count')
                ->limit(5)
                ->get(),
            'recent_scans' => $page->scans()
                ->latest('scanned_at')
                ->limit(10)
                ->get(),
            'recent_clicks' => LinkClick::with('link:id,page_id,title,type')
                ->whereHas('link', fn ($query) => $query->where('page_id', $page->id))
                ->latest('clicked_at')
                ->limit(10)
                ->get(),
        ];
    }

    private function requestMeta(Request $request): array
    {
        $agent = (string) $request->userAgent();

        return [
            'ip_address' => $request->ip(),
            'user_agent' => $agent,
            'device' => str_contains(strtolower($agent), 'mobile') ? 'Mobile' : 'Desktop',
            'browser' => $this->detectBrowser($agent),
        ];
    }

    private function detectBrowser(string $agent): string
    {
        return match (true) {
            str_contains($agent, 'Edg') => 'Edge',
            str_contains($agent, 'Chrome') => 'Chrome',
            str_contains($agent, 'Firefox') => 'Firefox',
            str_contains($agent, 'Safari') => 'Safari',
            default => 'Unknown',
        };
    }
}
