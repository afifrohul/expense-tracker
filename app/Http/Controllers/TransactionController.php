<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Category;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transaction = Transaction::with('category')->orderBy('date', 'desc')->get();
        $category = Category::get();
        return Inertia::render('Transaction', [
            'all_category' => $category
        ]);
    }

    public function data(Request $request)
    {
        $search = $request->input('search', null);
        $perPage = max((int) $request->input('perPage', 10), 1);
        $sortField = $request->input('sort', 'date'); 
        $sortOrder = $request->input('order', 'desc'); 

        $allowedSortFields = ['id', 'description', 'date', 'amount', 'type', 'category_name'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'date';
        }

        $transaction = Transaction::with('category')
            ->when($search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->orderBy($sortField, $sortOrder)
            ->paginate($perPage);

        $data = collect($transaction->items())->map(function ($item) {
            return [
                'id' => $item->id,
                'description' => $item->description,
                'date' => $item->date,
                'amount' => $item->amount,
                'type' => $item->type,

                'category_id' => $item->category?->id,
                'category_name' => $item->category?->name,
            ];
        });

        return response()->json([
            'data' => $data,
            'total' => $transaction->total(),
            'per_page' => $transaction->perPage(),
            'current_page' => $transaction->currentPage(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required',
            'type' => 'required',
            'amount' => 'required',
            'date' => 'required',
        ]);

        $transaction = Transaction::create([
            'description' => $request->description,
            'type' => $request->type,
            'category_id' => $request->category,
            'amount' => $request->amount,
            'date' => $request->date,
        ]);

        $transaction->load('category');

        return response()->json(['message' => 'Berhasil menambah data', 'transaction' => $transaction], 201);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'description' => 'required',
            'type' => 'required',
            'amount' => 'required',
            'date' => 'required',
        ]);

        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $transaction->update([
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'category_id' => $request->category,
            'amount' => $request->amount,
            'date' => $request->date,
        ]);

        $transaction->load('category');

        return response()->json(['message' => 'Berhasil mengubah data', 'transaction' => $transaction], 201);
    }

    public function destroy(string $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        $transaction->delete();

        $all_transaction = Transaction::with(['category'])->get();

        return response()->json(['message' => 'Berhasil menghapus data', 'transaction' => $all_transaction], 201);
    }
}
