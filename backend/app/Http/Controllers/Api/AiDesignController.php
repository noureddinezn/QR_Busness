<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateContentRequest;
use App\Http\Requests\GenerateDesignRequest;
use App\Http\Requests\GenerateImageRequest;
use App\Services\AiDesignService;
use Illuminate\Http\JsonResponse;
use RuntimeException;
use Throwable;

class AiDesignController extends Controller
{
    public function design(GenerateDesignRequest $request, AiDesignService $service): JsonResponse
    {
        try {
            return response()->json(['data' => $service->generateDesign($request->validated())]);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage() ?: 'AI generation is temporarily unavailable. Please try again.'], 503);
        } catch (Throwable) {
            return response()->json(['message' => 'AI generation is temporarily unavailable. Please try again.'], 503);
        }
    }

    public function image(GenerateImageRequest $request, AiDesignService $service): JsonResponse
    {
        try {
            return response()->json(['image_url' => $service->generateImage($request->validated('prompt'))]);
        } catch (Throwable) {
            return response()->json(['message' => 'AI image generation is temporarily unavailable. Please try again.'], 503);
        }
    }

    public function content(GenerateContentRequest $request, AiDesignService $service): JsonResponse
    {
        try {
            return response()->json(['data' => $service->generateContent($request->validated())]);
        } catch (Throwable) {
            return response()->json(['message' => 'AI content generation is temporarily unavailable. Please try again.'], 503);
        }
    }
}
