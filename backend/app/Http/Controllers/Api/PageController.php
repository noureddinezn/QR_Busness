<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pages = $request->user()
            ->pages()
            ->withCount(['links', 'scans'])
            ->latest()
            ->get()
            ->map(fn (Page $page) => $this->transformPage($page));

        return response()->json(['data' => $pages]);
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['is_active'] = $request->boolean('is_active', true);

        $this->storeImages($request, $data);

        $page = Page::create($data);

        return response()->json(['data' => $this->transformPage($page->load('links'))], 201);
    }

    public function show(Request $request, Page $page): JsonResponse
    {
        $this->ensureOwner($request, $page);

        return response()->json(['data' => $this->transformPage($page->load('links'))]);
    }

    public function update(UpdatePageRequest $request, Page $page): JsonResponse
    {
        $this->ensureOwner($request, $page);

        $data = $request->validated();
        $this->storeImages($request, $data);
        $page->update($data);

        return response()->json(['data' => $this->transformPage($page->fresh('links'))]);
    }

    public function destroy(Request $request, Page $page): JsonResponse
    {
        $this->ensureOwner($request, $page);
        $page->delete();

        return response()->json(['message' => 'Page deleted.']);
    }

    public function publicShow(string $slug, Request $request, AnalyticsService $analytics): JsonResponse
    {
        $page = Page::with(['activeLinks'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $analytics->recordScan($page, $request);

        return response()->json(['data' => $this->transformPage($page)]);
    }

    private function ensureOwner(Request $request, Page $page): void
    {
        abort_if($page->user_id !== $request->user()->id, 403, 'You do not own this page.');
    }

    private function storeImages(Request $request, array &$data): void
    {
        foreach (['logo', 'cover_image'] as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store($field.'s', 'public');
            }
        }
    }

    private function transformPage(Page $page): array
    {
        $page->loadMissing('links');
        $data = $page->toArray();
        $data['logo_url'] = $page->logo ? Storage::disk('public')->url($page->logo) : null;
        $data['cover_image_url'] = $page->cover_image ? Storage::disk('public')->url($page->cover_image) : null;
        $frontend = rtrim((string) config('app.frontend_url'), '/');
        $data['public_url'] = $frontend.'/p/'.$page->slug;
        $data['links'] = $page->relationLoaded('activeLinks')
            ? $page->activeLinks->values()
            : $page->links->values();

        return $data;
    }
}
