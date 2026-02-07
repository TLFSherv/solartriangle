export default function DashboardSkeleton() {
    let tableHeaders = Array.from({ length: 5 }, (_, i) => <div key={i} className="bg-[#626161] w-[70px] h-[18px] rounded-lg"></div>)
    return (
        <div className="flex flex-col space-y-6 mb-4">
            <div className="w-[90%] mx-auto mt-8 bg-[#151515] rounded-lg space-y-5 p-4">
                <div className="flex justify-between animate-pulse">
                    {tableHeaders.map(th => th)}
                </div>
                <div className="flex flex-col space-y-5 animate-pulse">
                    <div className="bg-[#626161] h-[19px] rounded-lg"></div>
                    <div className="bg-[#626161] h-[19px] rounded-lg"></div>
                </div>
            </div>
            <div className="flex flex-col mx-auto w-[90%] h-[340px] bg-[#151515] rounded-lg py-6 space-y-6">
                <div className="animate-pulse w-4/5 h-[200px] mx-auto bg-[#626161] rounded-xl"></div>
                <div className="animate-pulse w-4/5 h-[60px] mx-auto bg-[#626161] rounded-xl"></div>
            </div>
            <div className="flex flex-col mx-auto w-[90%] h-[310px] bg-[#151515] rounded-lg py-6 space-y-4">
                <div className="flex justify-center space-x-4">
                    <div className="animate-pulse w-[18px] h-[90px] my-auto bg-[#626161] rounded-xl"></div>
                    <div className="animate-pulse w-4/5 h-[230px] bg-[#626161] rounded-xl"></div>
                </div>
                <div className="animate-pulse w-[90px] h-[18px] mx-auto bg-[#626161] rounded-xl"></div>
            </div>
        </div>
    )
}