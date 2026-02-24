import { getCachedCalculatorData } from "@/actions/data"
import toast, { Toaster } from "react-hot-toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    let cacheResult = await getCachedCalculatorData();
    if (!cacheResult.data) {
        toast("Error displaying location data");
        return
    }
    return (
        <div className="space-y-8 sm:space-y-16 mt-10 sm:mt-16 text-[#F2F2F0]">
            <div className="flex flex-col items-center font-[Space_Grotesk]">
                <div className="mx-auto"><Toaster /></div>
                {(cacheResult.data &&
                    <ol className="font-[Darker_Grotesque] font-medium tracking-wide text-gray-300 text-lg sm:text-xl md:text-2xl">
                        <li>Country: <span className="font-light">{cacheResult.data.location.country}</span></li>
                        <li>Address: <span className="font-light">{cacheResult.data.location.address}</span></li>
                        <li>Time zone: <span className="font-light">{cacheResult.data.location.timeZone}</span></li>
                    </ol>)}
            </div>
            {children}
        </div>
    )
}

