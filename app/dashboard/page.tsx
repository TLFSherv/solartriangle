"use client"
import React, { useMemo } from "react";
import useFetchData from "./hooks/useFetchData";
import { poa_monthly, time_daily, gti_daily, data } from "./test-data/data";
import Chart from "./components/Chart";
import ChartMenu from "./components/ChartMenu";
import { useState } from "react";

type Dataset = {
    x: string[] | number[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
}

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

    const [selected, setSelected] = useState<number[]>([1]);
    const dataset: Dataset[] = useMemo(() => filterData(time_daily), [time_daily]);

    let months = [];
    for (let i = 0; i < 12; i++) {
        months.push(i);
    }

    let selectedDataset: Dataset;
    if (selected[0] === 0)
        selectedDataset = (selected.length > 1) ?
            dataset[selected[1]] :
            { x: time_daily, y: gti_daily, type: "days" };
    else selectedDataset = { x: months, y: poa_monthly, type: "months" };

    function filterData(timeData: string[]): Dataset[] {
        let prevDate: Date = new Date(timeData[0]);
        let dataset: Dataset[] = Array(7).fill({ x: [], y: [], type: 'hrs' });
        let start = 0;

        for (let i = 0; i < timeData.length; ++i) {
            let date = new Date(timeData[i]);
            if (date.getUTCDate() !== prevDate.getUTCDate()) {
                dataset[prevDate.getUTCDay()] = {
                    x: time_daily.slice(start, i),
                    y: gti_daily.slice(start, i),
                    type: 'hrs'
                };
                start = i;
            }
            prevDate = date;
        }

        return dataset;
    }

    return (
        <div className="h-[100px] w-full">
            <ChartMenu
                selected={selected}
                setSelected={setSelected} />
            <Chart dataset={selectedDataset} />
        </div>
    )
}



