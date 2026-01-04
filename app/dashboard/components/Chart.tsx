'use client'
import React, { useState } from "react";
import formatData from "../lib/formatData";
import ChartData from "./ChartData";
import ChartMenu from "./ChartMenu";

export default function Chart({ data }:
    { data: any[] }) {
    const [dataId, setDataId] = useState<number>(0);
    const [timeId, setTimeId] = useState<number[]>([0]);
    const dataset = formatData(data, dataId, timeId);
    console.log(dataset);

    return (
        <div className="w-full text-center">
            <ChartMenu
                dataId={dataId}
                setDataId={setDataId}
                timeId={timeId}
                setTimeId={setTimeId} />
            <ChartData dataset={dataset} />
        </div>
    );
}