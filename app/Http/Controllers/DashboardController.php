<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $totalIncome = Transaction::where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('type', 'expense')->sum('amount');
        $totalBalance = $totalIncome - $totalExpense;

        // Ambil bulan dan tahun saat ini
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Total pemasukan bulan ini
        $monthlyIncome = Transaction::where('type', 'income')
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('amount');

        // Total pengeluaran bulan ini
        $monthlyExpense = Transaction::where('type', 'expense')
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('amount');

        // Selisih pemasukan dan pengeluaran bulan ini
        $monthlyDifference = $monthlyIncome - $monthlyExpense;

        $yearsCount = DB::table('transactions')
        ->select(DB::raw('YEAR(date) as id, YEAR(date) as name'))
        ->distinct()
        ->orderBy('id', 'desc')
        ->get();

        $topCategories = DB::table('transactions')
        ->select('categories.name', DB::raw('COUNT(transactions.id) as total_transactions'))
        ->join('categories', 'transactions.category_id', '=', 'categories.id')
        ->groupBy('categories.name')
        ->orderByRaw('COUNT(transactions.id) DESC')
        ->limit(5)
        ->get();

        $recentTransaction = Transaction::with('category')->orderBy('date', 'desc')->limit(6)->get();

        return Inertia::render('Dashboard', [
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'total_balance' => $totalBalance,
            'monthly_income' => $monthlyIncome,
            'monthly_expense' => $monthlyExpense,
            'monthly_difference' => $monthlyDifference,
            'all_years' => $yearsCount,
            'top_categories' => $topCategories,
            'recent_transaction' => $recentTransaction
        ]);
    }

    public function getAnnualSummary(Request $request)
    {
        $year = $request->query('year', date('Y')); // Tahun default adalah tahun saat ini

        // Daftar semua bulan dalam setahun
        $months = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
            5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Aug',
            9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
        ];

        // Query untuk mendapatkan pemasukan dan pengeluaran berdasarkan bulan
        $data = DB::table('transactions')
            ->selectRaw("
                MONTH(date) as month, 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, 
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
            ")
            ->whereYear('date', $year)
            ->groupByRaw('MONTH(date)')
            ->get()
            ->keyBy('month'); // Mengelompokkan data berdasarkan bulan

        // Gabungkan semua bulan dengan hasil query
        $result = collect($months)->map(function ($monthName, $monthNumber) use ($data) {
            $transaction = $data->get($monthNumber); // Mendapatkan data transaksi berdasarkan bulan
            return [
                'month' => $monthName,
                'income' => $transaction->income ?? 0,
                'expense' => $transaction->expense ?? 0,
            ];
        })->values(); // Mengembalikan array berurutan tanpa key

        return response()->json($result);
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



}
