"use client"
import React, { useEffect, useState } from "react";

type FormInputs = {
    address: string;
    location: { lat: number; lng: number } | null;
    polygons: { id: number; polygon: google.maps.Polygon }[];
    solarArrays: SolarArray[];
}
type SolarArray = {
    id: number;
    solarCapacity: number;
    numberOfPanels: number;
    area: number;
    azimuth: number;
    shape: google.maps.LatLng[];
}
export default function SolarArrayForm(props: {
    inputs: FormInputs,
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
    activeId: number,
    setActiveId: React.Dispatch<React.SetStateAction<number>>
}) {
    const { polygons, solarArrays } = props.inputs;
    const { activeId, setActiveId } = props;

    useEffect(() => {
        if (polygons.length === 0 && solarArrays[0].id === 0) return;

        const polygonIds = polygons.map((p) => p.id);
        // discard objs in solarArrays that don't have ids in polygonIds
        let result = solarArrays.filter((sa) => polygonIds.includes(sa.id));

        // create solarArray objects for the ids that aren't in solarArrayIds
        polygonIds.forEach((id, i) => {
            if (i < result.length && id === result[i].id) return;
            else result.push(
                {
                    id: id,
                    solarCapacity: 0,
                    numberOfPanels: 1,
                    area: 0,
                    azimuth: 0,
                    shape: polygons[i].polygon.getPath().getArray()
                }
            )
        });
        console.log(result);
        props.setInputs(prev => ({ ...prev, solarArrays: result }));
    }, [polygons])


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        type PropertyNames = 'solarCapacity' | 'numberOfPanels' | 'area' | 'azimuth';
        let name = e.target.name as PropertyNames;
        props.setInputs(prev => ({
            ...prev,
            solarArrays: solarArrays.map((item, i) =>
                (i === activeIndex ? { ...item, [name]: parseInt(e.target.value) } : item))
        }));
    }

    const activeIndex = solarArrays.findIndex((sa) => sa.id === activeId);

    return (
        <div className="flex justify-evenly border-2 border-[#787572] rounded-xl p-6 gap-8 max-w-3xl mx-auto">
            <div className="flex-1 my-auto">
                <ol className="text-center font-[Space_Grotesk] py-3">
                    {solarArrays.map(sa => {
                        return <li key={sa.id}
                            className={activeId === sa.id ? "text-[#DD6B19]" : ""}
                            onClick={() => setActiveId(sa.id)}>
                            Solar array {sa.id}
                        </li>
                    })}
                </ol>
            </div>
            <div className="flex-2 grid grid-cols-2 grid-rows-2 gap-6 text-sm max-h-[200px] my-auto">
                <div className="space-y-1">
                    <label className="block text-center" htmlFor="solarCapacity">
                        Solar capacity
                    </label>
                    <input
                        name="solarCapacity"
                        value={isNaN(solarArrays[activeIndex]?.solarCapacity) ? 0 : solarArrays[activeIndex]?.solarCapacity}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false" />
                </div>
                <div className="space-y-1">
                    <label className="text-center block" htmlFor="numberOfPanels">
                        Number of panels
                    </label>
                    <input
                        name="numberOfPanels"
                        value={solarArrays[activeIndex]?.numberOfPanels}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false" />
                </div>
                <div className="space-y-1">
                    <label className="text-center block" htmlFor="azimuth">
                        Azimuth
                    </label>
                    <input
                        name="azimuth"
                        value={solarArrays[activeIndex]?.azimuth}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false" />
                </div>
                <div className="space-y-1">
                    <label className="text-center block" htmlFor="area">
                        Area
                    </label>
                    <input
                        name="area"
                        value={solarArrays[activeIndex]?.area}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false" />
                </div>
                <div className="col-span-2 space-x-1 mt">
                    <input className="accent-black" type="checkbox" name="useArea" />
                    <label>Use area to estimate number of panels</label>
                </div>
            </div>
        </div>
    )
}