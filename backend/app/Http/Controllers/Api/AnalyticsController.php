<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function show(Request $request, Page $page, AnalyticsService $analytics): JsonResponse
    {
        abort_if($page->user_id !== $request->user()->id, 403, 'You do not own this page.');

        return response()->json(['data' => $analytics->pageSummary($page)]);
    }
}
