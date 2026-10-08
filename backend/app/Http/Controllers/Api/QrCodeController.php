<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\QrCode;
use App\Services\QrCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QrCodeController extends Controller
{
    public function index(Request $request, Page $page, QrCodeService $service): JsonResponse
    {
        $this->ensureOwner($request, $page);

        return response()->json(['data' => $service->allForPage($page)]);
    }

    public function generate(Request $request, Page $page, QrCodeService $service): JsonResponse
    {
        $this->ensureOwner($request, $page);

        return response()->json(['data' => $service->allForPage($page)]);
    }

    public function download(Request $request, Page $page, QrCodeService $service): JsonResponse
    {
        $this->ensureOwner($request, $page);
        $qr = $service->mainForPage($page);

        return response()->json(['data' => $qr]);
    }

    private function ensureOwner(Request $request, Page $page): void
    {
        abort_if($page->user_id !== $request->user()->id, 403, 'You do not own this page.');
    }
}
