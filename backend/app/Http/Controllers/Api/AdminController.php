<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LinkClick;
use App\Models\Page;
use App\Models\Scan;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json(['data' => User::latest()->get()]);
    }

    public function updateUserStatus(Request $request, User $user): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate(['is_active' => ['required', 'boolean']]);
        $user->update($data);

        return response()->json(['data' => $user->fresh()]);
    }

    public function pages(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json([
            'data' => Page::with('user:id,name,email')->withCount(['links', 'scans'])->latest()->get(),
        ]);
    }

    public function updatePageStatus(Request $request, Page $page): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate(['is_active' => ['required', 'boolean']]);
        $page->update($data);

        return response()->json(['data' => $page->fresh()]);
    }

    public function stats(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json([
            'data' => [
                'total_users' => User::count(),
                'total_pages' => Page::count(),
                'total_scans' => Scan::count(),
                'total_link_clicks' => LinkClick::count(),
            ],
        ]);
    }

    private function ensureAdmin(Request $request): void
    {
        abort_if($request->user()?->role !== 'admin', 403, 'Admin access required.');
    }
}
