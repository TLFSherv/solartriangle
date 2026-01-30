import { getCachedData } from "@/actions/data"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    let { data, success, error } = await getCachedData('calculatorData');
    return (
        <div className="space-y-8">
            <h1 className="text-center pt-10 font-[Space_Grotesk] text-4xl font-light text-[#6E6E6E] tracking-wide">
                Solar Dashboard
            </h1>
            <div className="flex justify-center">
                {success && (
                    <ol className="space-y-2 font-[Space_Grotesk] font-medium tracking-wide text-gray-400">
                        <li>Address: <span className="font-light">{data?.address}</span></li>
                        <li>Latitude: <span className="font-light">{data?.lat}</span></li>
                        <li>Longitude: <span className="font-light">{data?.lng}</span></li>
                    </ol>)}
            </div>
            {children}
        </div>
    )
}

