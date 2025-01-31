<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticController extends Controller
{
    public function index()
    {
        $yearsCount = DB::table('transactions')
        ->select(DB::raw('YEAR(date) as id, YEAR(date) as name'))
        ->distinct()
        ->orderBy('id', 'desc')
        ->get();

        return Inertia::render('Analytic', [
            'all_years' => $yearsCount,
        ]);
    }

    public function getDailyExpenses(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // Hitung jumlah hari dalam bulan yang dipilih
        $daysInMonth = Carbon::create($year, $month, 1)->daysInMonth;

        // Ambil transaksi pengeluaran harian
        $expenses = DB::table('transactions')
            ->selectRaw('DAY(date) as day, SUM(amount) as total_expense')
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->where('type', 'expense') // Sesuaikan dengan field yang menandakan pengeluaran
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        // Buat daftar tanggal lengkap sesuai jumlah hari dalam bulan
        $formattedData = collect(range(1, $daysInMonth))->map(function ($day) use ($expenses, $year, $month) {
            return [
                'date' => sprintf('%04d-%02d-%02d', $year, $month, $day), // Format YYYY-MM-DD
                'expense' => $expenses->firstWhere('day', $day)->total_expense ?? 0
            ];
        });

        return response()->json($formattedData);
    }

    public function getExpenseByCategory(Request $request)
    {
        $month = $request->input('month', now()->month); // Format: 1 - 12
        $year = $request->input('year', now()->year);   // Format: 2024

        $query = DB::table('transactions')
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->select('categories.name as category', DB::raw('SUM(transactions.amount) as total'))
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->where('transactions.type', 'expense') // Hanya pengeluaran
            ->groupBy('categories.name');

        $expenses = $query->get();

        return response()->json($expenses);
    }

    public function getYearlySummary()
    {
        // Query untuk mendapatkan pemasukan dan pengeluaran berdasarkan tahun
        $data = DB::table('transactions')
            ->selectRaw("
                YEAR(date) as year, 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, 
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
            ")
            ->groupByRaw('YEAR(date)')
            ->orderBy('year', 'asc') // Urutkan dari tahun terkecil ke terbesar
            ->get();

        return response()->json($data);
    }


}
