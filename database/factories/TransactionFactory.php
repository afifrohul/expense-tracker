<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = \App\Models\Transaction::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::all()->random()->id, // Pilih kategori acak
            'date' => $this->faker->dateTimeBetween('-2 year', 'now'), // Tanggal dalam 1 tahun terakhir
            'amount' => $this->faker->randomFloat(2, 50000, 100000), 
            'description' => $this->faker->sentence(), // Deskripsi acak
            'type' => $this->faker->randomElement(['income', 'expense']), // Jenis transaksi
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
