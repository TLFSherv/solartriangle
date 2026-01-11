'use client'
import React, { useState } from "react";
import * as d3 from "d3";
import GoogleMap from "./GoogleMap";
import HeatMap from "./HeatMap";
import formatHeatMapData from "../lib/formatMapData";

export default function Map({ data }: { data: any[] }) {
    const [dataId, setDataId] = useState(0);
    const [formattedData, dataRanges] = formatHeatMapData(data);
    const gradientProps = [
        { offset: 0, stopColor: "#02020C" },
        { offset: 16, stopColor: "#41006A" },
        { offset: 32, stopColor: "#911A6B" },
        { offset: 48, stopColor: "#E7434C" },
        { offset: 54, stopColor: "#E4404E" },
        { offset: 70, stopColor: "#F05C4E" },
        { offset: 86, stopColor: "#FCC37E" },
        { offset: 100, stopColor: "#FBFFB2" },
    ];
    const dataColors: string[] = [];
    formattedData.forEach(data => {
        const value = 100 * ((data[dataId] - dataRanges[dataId][0]) / (dataRanges[dataId][1] - dataRanges[dataId][0]));
        const id = gradientProps.findIndex(color => value < color.offset);

        const { offset: d1, stopColor: r1 } = gradientProps[id - 1];
        const { offset: d2, stopColor: r2 } = gradientProps[id];

        const colorScale = d3.scaleLinear([d1, d2], [r1, r2]);
        dataColors.push(colorScale(value));
    });

    return (
        <div className="space-y-8 text-center">
            <MapMenu
                dataId={dataId}
                setDataId={setDataId} />
            <div>
                <GoogleMap dataColors={dataColors} />
                <HeatMap
                    data={formattedData}
                    dataId={dataId}
                    dataRanges={dataRanges}
                    gradientProps={gradientProps} />
            </div>
        </div>
    )
}

function MapMenu({ dataId, setDataId }:
    { dataId: number, setDataId: React.Dispatch<React.SetStateAction<number>> }) {
    const titles = ['AC Power Output',
        'Solar Radiation Annual',
        'Solar Capacity Factor'];
    return (
        <div className="space-y-5">
            <p className="font-[Space_Grotesk] px-4 text-sm">Change the data displayed with the buttons below:</p>
            <div className="space-y-8">
                <div className="flex justify-center gap-4">
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(0)} defaultChecked />
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(1)} />
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(2)} />
                </div>
                <h1 className='text-4xl font-[Darker_Grotesque] tracking-wider text-[#F0662A] '>
                    {titles[dataId]}
                </h1>
            </div>
        </div>
    )
}