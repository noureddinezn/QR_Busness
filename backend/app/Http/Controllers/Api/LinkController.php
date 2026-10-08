<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreLinkRequest;
use App\Http\Requests\UpdateLinkRequest;
use App\Http\Controllers\Controller;
use App\Models\Link;
use App\Models\Page;
use App\Services\AnalyticsService;
use App\Services\QrCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    public function store(StoreLinkRequest $request, Page $page): JsonResponse
    {
        $this->ensurePageOwner($request, $page);

        $data = $request->validated();
        $data['position'] = $data['position'] ?? ($page->links()->max('position') + 1);
        $data['is_active'] = $request->boolean('is_active', true);

        $link = $page->links()->create($data);

        return response()->json(['data' => $link], 201);
    }

    public function update(UpdateLinkRequest $request, Link $link): JsonResponse
    {
        $this->ensureLinkOwner($request, $link);
        $link->update($request->validated());

        return response()->json(['data' => $link->fresh()]);
    }

    public function destroy(Request $request, Link $link): JsonResponse
    {
        $this->ensureLinkOwner($request, $link);
        $link->delete();

        return response()->json(['message' => 'Link deleted.']);
    }

    public function position(Request $request, Link $link): JsonResponse
    {
        $this->ensureLinkOwner($request, $link);

        $data = $request->validate([
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $link->update($data);

        return response()->json(['data' => $link->fresh()]);
    }

    public function click(Link $link, Request $request, AnalyticsService $analytics, QrCodeService $qr): JsonResponse
    {
        abort_if(! $link->is_active || ! $link->page?->is_active, 404);

        $analytics->recordLinkClick($link, $request);

        return response()->json([
            'target_url' => $qr->normaliseTarget($link),
        ]);
    }

    private function ensurePageOwner(Request $request, Page $page): void
    {
        abort_if($page->user_id !== $request->user()->id, 403, 'You do not own this page.');
    }

    private function ensureLinkOwner(Request $request, Link $link): void
    {
        $link->loadMissing('page');
        $this->ensurePageOwner($request, $link->page);
    }
}
