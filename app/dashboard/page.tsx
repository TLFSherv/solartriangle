"use client"
import React, { useMemo } from "react";
import useFetchData from "./hooks/useFetchData";
import { poa_monthly, time_daily, gti_daily, poa_hourly } from "./test-data/data";
import Chart from "./components/Chart";
import ChartMenu from "./components/ChartMenu";
import { useState } from "react";

type Dataset = {
    x: string[];
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

    const [selected, setSelected] = useState<number[]>([0]);
    const dataset: Dataset[] = useMemo(() => groupByDate(time_daily), [time_daily]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];

    /*
        1. Number of days in month 
            month_hours = num_days * 24hr;
        2. parse array to get poa values per month
        3. sum the poa for each day in each month
    */
    const daysPerMonth = new Array(12).fill(0).map((_, index) => new Date(2025, index + 1, 0).getDate())
    let hourlyPoaByMonth: { month: number; hourlyPoa: number[] }[] = [];

    let initialValue = 0, totalHrs = 0;
    daysPerMonth.forEach((days, i) => {
        totalHrs += days * 24;
        const hourlyPoa = poa_hourly.slice(initialValue, totalHrs)
        hourlyPoaByMonth.push({ month: i + 1, hourlyPoa });
        initialValue = totalHrs;
    })

    let dailyPoaByMonth: number[] = [];
    let dayOfMonth: string[] = [];
    if (selected[0] === 1 && selected.length > 1) {
        const m = selected[1];
        const poa = hourlyPoaByMonth[m].hourlyPoa;
        let poaDayTotal = 0;
        for (let i = 0; i < daysPerMonth[m]; ++i) {
            poaDayTotal = poa.slice(i * 24, 24 * (i + 1)).reduce((a, b) => a + b);
            dailyPoaByMonth.push(Math.round(poaDayTotal))
            dayOfMonth.push(`${months[m]} ${i + 1}`);
        }
    }

    console.log({ x: dayOfMonth, y: dailyPoaByMonth, type: 'days' });

    let gti_weekly: Dataset = { x: [], y: [], type: "days" };
    dataset.forEach(({ x, y }) => {
        gti_weekly.x.push(x[0])
        const gtiDailySum = y.reduce((accumulator, currentValue) => accumulator + currentValue)
        gti_weekly.y.push(Math.round(gtiDailySum))
    })

    let selectedDataset: Dataset;
    if (selected[0] === 0)
        selectedDataset = (selected.length > 1) ? dataset[selected[1]] : gti_weekly;
    else {
        selectedDataset = (selected.length > 1) ? { x: dayOfMonth, y: dailyPoaByMonth, type: 'months' } : { x: months, y: poa_monthly, type: "months" };
    }

    function groupByDate(timeData: string[]): Dataset[] {
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



