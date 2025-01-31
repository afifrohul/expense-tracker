<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Category', [
            // 
        ]);
    }

    public function data(Request $request)
    {
        $search = $request->input('search', null);
        $perPage = max((int) $request->input('perPage', 10), 1); 
        $sortField = $request->input('sort', 'created_at');
        $sortOrder = $request->input('order', 'desc'); 

        $allowedSortFields = ['id', 'name', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }

        $category = Category::withCount('transactions')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy($sortField, $sortOrder)
            ->paginate($perPage);

        return response()->json([
            'data' => $category->items(),
            'total' => $category->total(),
            'per_page' => $category->perPage(),
            'current_page' => $category->currentPage(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $category = Category::create([
            'name' => $request->name,
        ]);

        $category->load('transactions');

        return response()->json(['message' => 'Berhasil menambah data', 'category' => $category], 201);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required'
        ]);

        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $category->update([
            'name' => $request->name,
        ]);

        $category->load('transactions');

        return response()->json(['message' => 'Berhasil mengubah data', 'category' => $category], 201);
    }

    public function destroy(string $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        $category->delete();

        $all_category = Category::with(['transactions'])->get();

        return response()->json(['message' => 'Berhasil menghapus data', 'category' => $all_category], 201);
    }
}
