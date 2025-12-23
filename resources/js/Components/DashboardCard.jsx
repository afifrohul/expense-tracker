export default function DashboardCard({ color, icon, data, desc, className }) {
    return (
        <div
            className={`flex flex-col justify-center rounded-lg border border-slate-400 p-4 ${className}`}
        >
            <div className="flex items-center w-full gap-4">
                <div
                    className={`w-10 h-10 rounded-full bg-${color}-100 border border-${color}-300 flex justify-center items-center`}
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
