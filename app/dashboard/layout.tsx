export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // const dataStr = localStorage.getItem("calculatorData");
    // const data = JSON.parse(dataStr as string);
    return (
        <div>
            <h1 className="text-center pt-14 font-[Space_Grotesk] text-4xl font-light text-[#DD6B19] tracking-wide">
                Solar Dashboard
            </h1>
            <ol className="ml-[10%] p-6 space-y-1 font-[Space_Grotesk] font-light text-sm">
                {/* <li>Address: {data.address}</li>
                <li>Latitude: {data.lat}</li>
                <li>Longitude: {data.lng}</li> */}
            </ol>
            {children}
        </div>
    )
}

