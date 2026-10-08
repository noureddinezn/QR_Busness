<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_type' => ['required', 'string', 'max:80'],
            'business_name' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:600'],
            'style' => ['required', 'string', 'max:60'],
            'mood' => ['required', 'string', 'max:60'],
            'language' => ['required', 'string', 'max:40'],
        ];
    }
}
