import { getCachedCalculatorData } from "@/actions/data"
import toast, { Toaster } from "react-hot-toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    let cacheResult = await getCachedCalculatorData();
    if (cacheResult.error) toast("Error displaying location data")
    return (
        <div className="space-y-8 text-[#F2F2F0]">
            <h1 className="text-center pt-10 font-[Space_Grotesk] text-4xl font-light text-[#6E6E6E] tracking-wide">
                Solar Dashboard
            </h1>
            <div className="flex justify-center">
                <div><Toaster /></div>
                {(cacheResult.data &&
                    <ol className="space-y-2 font-[Space_Grotesk] font-medium tracking-wide text-gray-400">
                        <li>Country: <span className="font-light">{cacheResult.data.location.country}</span></li>
                        <li>Address: <span className="font-light">{cacheResult.data.location.address}</span></li>
                        <li>Time zone: <span className="font-light">{cacheResult.data.location.timeZone}</span></li>
                    </ol>)}
            </div>
            {children}
        </div>
    )
}

