import { inputs } from "./test-data/data"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // const dataStr = localStorage.getItem("calculatorData");
    // const data = JSON.parse(dataStr as string);
    return (
        <div className="space-y-8">
            <h1 className="text-center pt-10 font-[Space_Grotesk] text-4xl font-light text-[#DD6B19] tracking-wide">
                Solar Dashboard
            </h1>
            <div className="flex justify-center">
                <ol className="space-y-2 font-[Space_Grotesk] font-medium tracking-wide text-gray-400">
                    <li>Address: <span className="font-light">{inputs.address}</span></li>
                    <li>Latitude: <span className="font-light">{inputs.lat}</span></li>
                    <li>Longitude: <span className="font-light">{inputs.lng}</span></li>
                </ol>
            </div>
            {children}
        </div>
    )
}

