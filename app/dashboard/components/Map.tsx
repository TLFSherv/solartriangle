'use client'
import React, { useState } from "react";
import GoogleMap from "./GoogleMap";
import HeatMap from "./HeatMap";
import formatHeatMapData from "../lib/formatMapData";

export default function Map({ data }: { data: any[] }) {
    const [dataId, setDataId] = useState(0);
    const [formattedData, dataRanges] = formatHeatMapData(data);
    return (
        <div className="space-y-5 text-center mx-auto">
            <MapMenu
                dataId={dataId}
                setDataId={setDataId} />
            <GoogleMap />
            <HeatMap
                data={formattedData}
                dataId={dataId}
                dataRanges={dataRanges} />
        </div>
    )
}

function MapMenu({ dataId, setDataId }:
    { dataId: number, setDataId: React.Dispatch<React.SetStateAction<number>> }) {
    const titles = ['AC Power Output',
        'Solar Radiation Annual',
        'Solar Capacity Factor']
    return (
        <div className="space-y-5">
            <p className="font-[Space_Grotesk] px-4 text-sm">Change the data displayed with the buttons below:</p>
            <div className="space-y-2">
                <div className="flex justify-center gap-4">
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(0)} defaultChecked />
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(1)} />
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(2)} />
                </div>
                <h1 className='text-3xl font-[Darker_Grotesque] tracking-wider text-[#F0662A] '>
                    {titles[dataId]}
                </h1>
                <p className='font-[Space_Grotesk] px-4 text-sm'>
                    Change the unit of time with the dropdown below the map.
                </p>
            </div>
        </div>
    )
}