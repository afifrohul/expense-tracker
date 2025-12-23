export const colorMap = {
    slate: {
        bg: "bg-slate-100",
        border: "border-slate-300",
        text: "text-slate-600",
    },
    gray: {
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-600",
    },
    zinc: {
        bg: "bg-zinc-100",
        border: "border-zinc-300",
        text: "text-zinc-600",
    },
    neutral: {
        bg: "bg-neutral-100",
        border: "border-neutral-300",
        text: "text-neutral-600",
    },
    stone: {
        bg: "bg-stone-100",
        border: "border-stone-300",
        text: "text-stone-600",
    },

    red: {
        bg: "bg-red-100",
        border: "border-red-300",
        text: "text-red-600",
    },
    orange: {
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-600",
    },
    amber: {
        bg: "bg-amber-100",
        border: "border-amber-300",
        text: "text-amber-600",
    },
    yellow: {
        bg: "bg-yellow-100",
        border: "border-yellow-300",
        text: "text-yellow-600",
    },
    lime: {
        bg: "bg-lime-100",
        border: "border-lime-300",
        text: "text-lime-600",
    },
    green: {
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-600",
    },
    emerald: {
        bg: "bg-emerald-100",
        border: "border-emerald-300",
        text: "text-emerald-600",
    },
    teal: {
        bg: "bg-teal-100",
        border: "border-teal-300",
        text: "text-teal-600",
    },
    cyan: {
        bg: "bg-cyan-100",
        border: "border-cyan-300",
        text: "text-cyan-600",
    },
    sky: {
        bg: "bg-sky-100",
        border: "border-sky-300",
        text: "text-sky-600",
    },
    blue: {
        bg: "bg-blue-100",
        border: "border-blue-300",
        text: "text-blue-600",
    },
    indigo: {
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-600",
    },
    violet: {
        bg: "bg-violet-100",
        border: "border-violet-300",
        text: "text-violet-600",
    },
    purple: {
        bg: "bg-purple-100",
        border: "border-purple-300",
        text: "text-purple-600",
    },
    fuchsia: {
        bg: "bg-fuchsia-100",
        border: "border-fuchsia-300",
        text: "text-fuchsia-600",
    },
    pink: {
        bg: "bg-pink-100",
        border: "border-pink-300",
        text: "text-pink-600",
    },
    rose: {
        bg: "bg-rose-100",
        border: "border-rose-300",
        text: "text-rose-600",
    },
};

export default function DashboardCard({ color, icon, data, desc, className }) {
    const c = colorMap[color];

    return (
        <div
            className={`flex flex-col justify-center rounded-lg border border-slate-400 p-4 ${className}`}
        >
            <div className="flex items-center w-full gap-4">
                <div
                    className={`w-10 h-10 rounded-full ${c.bg} ${c.border} border flex justify-center items-center`}
                >
                    {icon}
                </div>
                <div>
                    <p className="font-semibold text-sm">{data}</p>
                    <p className="text-xs">{desc}</p>
                </div>
            </div>
        </div>
    );
}
