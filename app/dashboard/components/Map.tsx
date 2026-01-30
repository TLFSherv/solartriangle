'use client'
import React, { useState } from "react";
import GoogleMap from "./GoogleMap";
import HeatMap from "./HeatMap";
import { formatMapData, getDataColors, gradientProps } from "../lib/dataTools";

export default function Map({ data }: { data: any[] }) {
    const [dataId, setDataId] = useState(0);
    const [formattedData, dataRanges] = formatMapData(data);
    const dataColors = getDataColors(formattedData, dataId, dataRanges);

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
            <p className="font-[Space_Grotesk] px-4 text-sm text-gray-400">Change the data displayed with the buttons below:</p>
            <div className="space-y-8">
                <div className="flex justify-center gap-4">
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(0)} defaultChecked />
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(1)} />
                    <input className="accent-black" type='radio' name="map_data" onClick={() => setDataId(2)} />
                </div>
                <h1 className='text-4xl font-[Darker_Grotesque] tracking-wider text-[#6E6E6E] '>
                    {titles[dataId]}
                </h1>
            </div>
        </div>
    )
}