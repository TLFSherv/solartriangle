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

    const [selected, setSelected] = useState<number[]>([0]);
    const dataset = useFormatData(selected);

    return (
        <div className="h-[100px] w-full">
            <ChartMenu
                selected={selected}
                setSelected={setSelected} />
            <Chart dataset={dataset} />
        </div>
    )
}



