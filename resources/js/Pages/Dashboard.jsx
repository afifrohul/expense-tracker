import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { formatRupiah } from './utils';
import { LuWallet } from "react-icons/lu";
import { BiCoinStack } from "react-icons/bi";
import { RiHandCoinLine } from "react-icons/ri";
import { LuArrowDownLeft, LuArrowUpRight } from "react-icons/lu";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { RiCoinsLine } from "react-icons/ri";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, } from 'recharts';
import axios from 'axios';
import {BsArrowUpRightCircle, BsArrowDownLeftCircle } from "react-icons/bs";


export default function Dashboard({ auth, total_income, total_expense, total_balance, monthly_expense, monthly_income, monthly_difference, all_years, top_categories, recent_transaction }) {
    const now = DateTime.fromISO(DateTime.now().toISODate()).setLocale('id').toLocaleString(DateTime.DATE_HUGE);
    const [time, setTime] = useState(new Date());


    const [year, setYear] = useState(new Date().getFullYear());
    // const [year, setYear] = useState(2024);
    const [chartData, setChartData] = useState([]);
    

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };


    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(`/api/transactions/summary?year=${year}`);
            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        fetchData();
    }, [year]);


    const roundToNearest = (value, base = 100000) => Math.ceil(value / base) * base;

    const maxIncome = Math.max(...chartData.map(d => d.income), 0);
    const maxExpense = Math.max(...chartData.map(d => d.expense), 0);
    
    const maxYAxis = roundToNearest(Math.max(maxIncome, maxExpense));
    

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard" />

            <div className='flex gap-4'>
                <div className='flex-1 flex flex-col gap-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 rounded-lg border border-slate-400 py-12'>
                            <h1 className='text-2xl font-mono font-semibold'>
                                {now}
                            </h1>
                        </div>
                        <div className='flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 rounded-lg border border-slate-400 py-12'>
                            <h1 className='text-3xl font-mono font-semibold'>
                                {formatTime(time)} WIB
                            </h1>
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <div className='border border-slate-300 rounded-lg w-fit p-4 flex flex-col gap-2'>
                            <div className='mb-2'>
                                <p className='font-bold text-xl'>Informasi Saldo</p>
                                <hr className='mt-2'/>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <LuWallet className='text-blue-800 text-2xl'/>
                                <p className='font-semibold'>Saldo tersedia: <span className='text-green-600'>{formatRupiah(total_balance)}</span></p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <BiCoinStack className='text-blue-800 text-2xl'/>
                                <p className='font-semibold'>Total pemasukan: <span className='text-blue-700 font-normal'>{formatRupiah(total_income)}</span></p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <RiHandCoinLine className='text-blue-800 text-2xl' />
                                <p className='font-semibold'>Total pengeluaran: <span className='text-blue-700 font-normal'>{formatRupiah(total_expense)}</span></p>
                            </div>

                            <hr className='my-4'/>
                            <div className='flex gap-2 items-center'>
                                <LuArrowDownLeft className='text-green-600 text-2xl'/>
                                <p className='font-semibold'>Total pemasukan (Bulan ini): <span className='font-normal'>{formatRupiah(monthly_income)}</span></p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <LuArrowUpRight className='text-red-600 text-2xl' />
                                <p className='font-semibold'>Total pengeluaran (Bulan ini): <span className='font-normal'>{formatRupiah(monthly_expense)}</span></p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <RiCoinsLine className='text-yellow-500 text-2xl' />
                                <p className='font-semibold'>Selisih: <span className='font-semibold text-teal-600'>{formatRupiah(monthly_difference)}</span></p>
                            </div>
                        </div>
                        <div className='border border-slate-300 p-4 rounded-lg w-full'>
                            <div className='w-full'>
                                <select
                                    id="year"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-700"
                                    value={year}
                                    onChange={e => setYear(e.target.value)}
                                >
                                    {all_years.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <ResponsiveContainer width="100%" height={400} className="p-3 w-full" >
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, maxYAxis]}/>
                                    <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
                                    <Legend />
                                    <Bar dataKey="income" name="Pemasukan" fill="#43a047" />
                                    <Bar dataKey="expense" name="Pengeluaran" fill="#283593" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='border border-slate-300 rounded-lg p-4'>
                            <div className='flex justify-between items-center'>
                                <h1 className='font-bold text-lg my-4'>Top Kategori</h1>
                                <Link href='/category' className='rounded px-3 py-2 duration-150 hover:cursor-pointer'>
                                    <div className='flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 duration-150 transition-all'><BsBoxArrowInUpRight /> Semua kategori</div>
                                </Link>
                            </div>
                            <hr className='mb-4'/>
                            <table className=" divide-y divide-gray-200 overflow-scroll w-full" id="dataTable">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" id='headIndex' className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Kategori
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah Transaksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {top_categories.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <div className="text-sm text-gray-900" id='index'>{index + 1}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-normal break-words">
                                                <div className="text-sm text-gray-900">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.total_transactions}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='border border-slate-300 rounded-lg p-4'>
                            <div className='flex justify-between items-center'>
                                <h1 className='font-bold text-lg my-4'>Trasanksi Terakhir</h1>
                                <Link href='/transaction' className='rounded px-3 py-2 duration-150 hover:cursor-pointer'>
                                    <div className='flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 duration-150 transition-all'><BsBoxArrowInUpRight /> Semua transaksi</div>
                                </Link>
                            </div>
                            <hr className='mb-4'/>
                            <div className='flex flex-col gap-3'>
                                {recent_transaction.map((item, index) => (
                                <div key={index} className='flex gap-4 items-center'>
                                    {
                                        item.type == 'income' ? (
                                            <BsArrowDownLeftCircle className='text-2xl text-green-600'/>
                                        ) :
                                        (
                                            <BsArrowUpRightCircle className='text-2xl text-red-600'/>
                                        )
                                    }
                                    <div className='flex items-center justify-between w-full'>
                                        <div className=''>
                                            <h1 className='font-medium'>{item.category.name}</h1>
                                            <p className='text-xs text-gray-500'>{DateTime.fromISO(item.date).setLocale('id').toLocaleString(DateTime.DATE_FULL)}</p>
                                        </div>
                                        <div>
                                            {
                                                item.type == 'income' ? (
                                                    <p className='text-sm text-green-600'>+ {formatRupiah(item.amount)}</p>
                                                ) :
                                                (
                                                    <p className='text-sm text-red-600'>- {formatRupiah(item.amount)}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>                
            </div>

        </AuthenticatedLayout>
    );
}
