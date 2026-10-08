<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:120'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:80',
                'alpha_dash:ascii',
                Rule::unique('pages', 'slug')->ignore($this->route('page')?->id),
            ],
            'bio' => ['nullable', 'string', 'max:500'],
            'logo' => ['nullable', 'image', 'max:5120'],
            'cover_image' => ['nullable', 'image', 'max:8192'],
            'theme' => ['sometimes', 'required', 'string', 'max:60'],
            'primary_color' => ['nullable', 'string', 'max:20'],
            'secondary_color' => ['nullable', 'string', 'max:20'],
            'background_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'button_style' => ['sometimes', 'in:rounded,pill,square'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
