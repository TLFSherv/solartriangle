"use client"
import React from "react";
import useFetchData from "./hooks/useFetchData";
import { poa_monthly, time_daily, gti_daily } from "./test-data/data";
import Chart from "./components/Chart";
import TimeAxis from "./components/TimeAxis";
import { useState } from "react";

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
    const [selected, setSelected] = useState<number[]>([]);
    type Dataset = {
        x: number[];
        y: number[];
        type: 'monthly' | 'hourly' | 'daily';
    }
    let months = [];
    for (let i = 1; i < 13; i++) {
        months.push(i);
    }
    // selected = [0];
    const poa = [{ x: months, y: poa_monthly, type: "monthly" }];


    return (
        <div className="h-[100px] w-full">
            <ChartMenu
                selected={selected}
                setSelected={setSelected} />
            <Chart dataset={poa[0] as Dataset} />
        </div>
    )
}

const ChartMenu = ({ selected, setSelected }:
    {
        selected: number[];
        setSelected: React.Dispatch<React.SetStateAction<number[]>>
    }) => {

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];
    const subMenu = [
        days.map((day, i) => (
            <li key={i}
                className={`px-3 cursor-pointer ${selected[1] === i ? "text-[#0BAFF5]" : ""}`}
                onClick={() => setSelected([0, i])}>{day}</li>)),
        months.map((month, i) => (
            <li key={i}
                className={`px-3 cursor-pointer ${selected[1] === i ? "text-[#0BAFF5]" : ""}`}
                onClick={() => setSelected([1, i])}>{month}</li>))
    ];
    return (
        <div className="space-y-2 mb-4">
            <ol className="flex justify-center divide-x-2 divide-[#444444]">
                <li className={`px-4 cursor-pointer ${selected[0] === 0 ? "text-[#0BAFF5]" : ""}`}
                    onClick={() => setSelected([0])}>d</li>
                <li className={`px-4 cursor-pointer ${selected[0] === 1 ? "text-[#0BAFF5]" : ""}`}
                    onClick={() => setSelected([1])}>m</li>
            </ol>
            <ol className="flex mx-auto divide-x-1 divide-[#444444] text-sm overflow-auto whitespace-nowrap h-[32px] w-[140px]">
                {subMenu[selected[0]]}
            </ol>
        </div>
    )
}



