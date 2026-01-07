//import { useState } from "react";
import getData from "./lib/getData";
import Chart from "./components/Chart";
import Map from "./components/Map";

export default async function Dashboard() {
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
    */
    const data = await getData();
    console.log(data);
    return (
        <div className="space-y-8">
            <Map data={data} />
            <Chart data={data} />
        </div>
    )
}



