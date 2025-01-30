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
            'transaction' => $transaction,
            'all_category' => $category
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
