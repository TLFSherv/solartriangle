'use client'
import React, { useState } from "react";
import GoogleMap from "./GoogleMap";
import HeatMap from "./HeatMap";
import { formatMapData, getDataColors, gradientProps } from "../lib/dataTools";

export default function Map({ data }: { data: any[] }) {
    const [dataId, setDataId] = useState(0);
    console.log(data);
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
            <p className="font-[Darker_Grotesque] px-4 text-lg sm:text-xl md:text-2xl text-gray-300 tracking-wider">
                Change the data displayed with the buttons below:
            </p>
            <div className="space-y-8">
                <div className="flex justify-center gap-4">
                    <input className="accent-orange-400" type='radio' name="map_data" onClick={() => setDataId(0)} defaultChecked />
                    <input className="accent-orange-400" type='radio' name="map_data" onClick={() => setDataId(1)} />
                    <input className="accent-orange-400" type='radio' name="map_data" onClick={() => setDataId(2)} />
                </div>
                <h1 className='text-4xl font-[Darker_Grotesque] font-medium tracking-wider text-[#6E6E6E]'>
                    {titles[dataId]}
                </h1>
            </div>
        </div>
    )
}