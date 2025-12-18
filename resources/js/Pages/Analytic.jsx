import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { formatRupiah } from "./utils";
import { LuWallet } from "react-icons/lu";
import { BiCoinStack } from "react-icons/bi";
import { RiHandCoinLine } from "react-icons/ri";
import { LuArrowDownLeft, LuArrowUpRight } from "react-icons/lu";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { RiCoinsLine } from "react-icons/ri";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import axios from "axios";
import { BsArrowUpRightCircle, BsArrowDownLeftCircle } from "react-icons/bs";

export default function Analytic({ auth, all_years }) {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

    const [ex_month, setExMonth] = useState(new Date().getMonth() + 1);
    const [ex_year, setExYear] = useState(new Date().getFullYear());
    const [chartDataEx, setChartDataEx] = useState([]);

    const [pie_month, setPieMonth] = useState(new Date().getMonth() + 1);
    const [pie_year, setPieYear] = useState(new Date().getFullYear());
    const [pieData, setPieData] = useState([]);

    const [yData, setYData] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(
                    `/api/daily-expenses?month=${ex_month}&year=${ex_year}`
                );
                setChartDataEx(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchExpenses();
    }, [ex_month, ex_year]);

    useEffect(() => {
        const fetchExpensesCategory = async () => {
            try {
                const response = await axios.get(
                    `/api/expenses-by-category?month=${pie_month}&year=${pie_year}`
                );
                setPieData(
                    response.data.map((item) => ({
                        ...item,
                        total: Number(item.total),
                    }))
                );
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchExpensesCategory();
    }, [pie_month, pie_year]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`/api/year-summary`);
                setYData(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchExpenses();
    }, []);

    const formatRupiahShort = (value) => {
        if (value >= 1_000_000_000) {
            return `${value / 1_000_000_000} M`;
        }
        if (value >= 1_000_000) {
            return `${value / 1_000_000} jt`;
        }
        if (value >= 1_000) {
            return `${value / 1_000} rb`;
        }
        return value;
    };

    const roundToNearest = (value, base = 100000) =>
        Math.ceil(value / base) * base;

    const maxExpenseEx = Math.max(...chartDataEx.map((d) => d.expense), 0);
    const maxYAxisEx = roundToNearest(Math.max(maxExpenseEx));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md p-2 rounded">
                    <p className="text-gray-700 font-bold">{payload[0].name}</p>
                    <p className="text-blue-500">
                        {formatRupiah(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analisis" />

            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-4">
                    <div className="border border-slate-300 p-4 rounded-lg w-full">
                        <div className="mb-2">
                            <p className="font-bold text-lg">
                                Data pengeluaran per hari
                            </p>
                            <hr className="mt-2" />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <select
                                    id="ex_month"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-700"
                                    value={ex_month}
                                    onChange={(e) => setExMonth(e.target.value)}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString(
                                                "id-ID",
                                                { month: "long" }
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full">
                                <select
                                    id="ex_year"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-700"
                                    value={ex_year}
                                    onChange={(e) => setExYear(e.target.value)}
                                >
                                    {all_years.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                            className="p-3 w-full"
                        >
                            <LineChart data={chartDataEx}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) =>
                                        new Date(date).getDate()
                                    }
                                />
                                <YAxis
                                    domain={[0, maxYAxisEx]}
                                    tickFormatter={formatRupiahShort}
                                    width={55}
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(value)
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4">
                        <div className="border border-slate-300 p-4 rounded-lg w-fit">
                            <div className="mb-2">
                                <p className="font-bold text-lg">
                                    Data pengeluaran berdasarkan kategori
                                </p>
                                <hr className="mt-2" />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <select
                                        id="pie_month"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-700"
                                        value={pie_month}
                                        onChange={(e) =>
                                            setPieMonth(e.target.value)
                                        }
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString(
                                                    "id-ID",
                                                    { month: "long" }
                                                )}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full">
                                    <select
                                        id="pie_year"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-700"
                                        value={pie_year}
                                        onChange={(e) =>
                                            setPieYear(e.target.value)
                                        }
                                    >
                                        {all_years.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex">
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={pieData}
                                        dataKey="total"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        label={({ name, value }) => `${name}`} // Format label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </div>
                        </div>
                        <div className="border border-slate-300 p-4 rounded-lg w-full">
                            <div className="mb-2">
                                <p className="font-bold text-lg">
                                    Data pemasukan dan pengeluaran per tahun
                                </p>
                                <hr className="mt-2" />
                            </div>
                            <div className="flex ">
                                <ResponsiveContainer
                                    width="100%"
                                    height={400}
                                    className="p-3 w-full"
                                >
                                    <BarChart
                                        data={yData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
                                        <YAxis
                                            tickFormatter={formatRupiahShort}
                                            width={55}
                                        />
                                        <Tooltip
                                            formatter={(value) =>
                                                new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(value)
                                            }
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="income"
                                            name="Pemasukan"
                                            fill="#43a047"
                                        />
                                        <Bar
                                            dataKey="expense"
                                            name="Pengeluaran"
                                            fill="#283593"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
