"use client"
import { useState } from "react";
import useFetchData from "./hooks/useFetchData";
import useFormatData from "./hooks/useFormatData";
import Chart from "./components/Chart";
import ChartMenu from "./components/ChartMenu";


export default function Dashboard() {
    // const result = useFetchData();
    // console.log(result);

    /*
   data in result = {
   pvwatts:[poa_monthly, ac_monthly, ac_annual, solrad_monthly, hr ac output, hr poa],
   openmeteo: [global_tilted_irradiance 3 past days, global_tilted_irradiance 7 days in future, temperature]
}
   Google maps with polygons as solar arrays, change color of the polygons to indicate
   the magnitude of the ac output produced by the panels for different periods

   graphs: 3 line graphs - Irradiation, Losses, AC output
   poa vs time (monthly, daily, hourly) [also show past data]
   temp/loss vs time (monthly, daily, hourly)
   ac output vs time (monthly, daily, hourly) - bar graph showing % of total produced at a give time 

    controls for selecting the time units

    */
    const [dataId, setDataId] = useState<number>(0);
    const [timeId, setTimeId] = useState<number[]>([0]);
    const dataset = useFormatData(dataId, timeId);
    const titles = ['Plane of array (poa)', 'Power Output', 'Power loss'];
    return (
        <div className="space-y-4 text-center">
            <p className="font-[Space_Grotesk] px-4 text-sm">Change the data displayed with the buttons below:</p>
            <div className="flex justify-center gap-4">
                <input className="accent-black" type='radio' name="data" onClick={() => setDataId(0)} defaultChecked />
                <input className="accent-black" type='radio' name="data" onClick={() => setDataId(1)} />
                <input className="accent-black" type='radio' name="data" onClick={() => setDataId(2)} />
            </div>
            <h1 className="text-2xl font-[Darker_Grotesque] tracking-wider text-[#F0662A]">
                {titles[dataId]}
            </h1>
            <div className="w-full">
                <ChartMenu
                    timeId={timeId}
                    setTimeId={setTimeId} />
                <Chart dataset={dataset} />
            </div>
        </div>

    )
}



