"use client"
import React, { useEffect } from "react";
import { getPolygonArea, getPolygonAzimuth } from "../lib/geometryTool";
import { FormInputs } from "@/app/types/types"


export default function SolarArrayForm(props: {
    inputs: FormInputs,
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
    activeId: number,
    setActiveId: React.Dispatch<React.SetStateAction<number>>
}) {
    const { polygons, solarArrays } = props.inputs;
    const { activeId, setActiveId } = props;
    let isEmpty = polygons.length === 0 && solarArrays.length === 0;

    useEffect(() => {
        const poly = polygons[activeIndex]?.polygon;

        if (isEmpty || !poly) return;

        const polygonPath = poly.getPath().getArray();
        const shape = polygonPath.map((p) => ({ lat: p.lat(), lng: p.lng() }))

        // check if polygon has changed
        const oldShape = solarArrays[activeIndex].shape;
        const isUnchanged = (shape.length === oldShape.length) &&
            shape.every((elem, i) => elem.lat === oldShape[i].lat && elem.lng === oldShape[i].lng);

        if (isUnchanged) return;

        const timeoutId = setTimeout(() => {
            const area = Number(getPolygonArea(poly).toFixed(2));
            const azimuth = Number(getPolygonAzimuth(poly).toFixed(2));

            if (area === solarArrays[activeIndex].area &&
                azimuth === solarArrays[activeIndex].azimuth) return;

            props.setInputs(prev => ({
                ...prev,
                solarArrays: solarArrays.map((item, i) =>
                (i === activeIndex ?
                    {
                        ...item,
                        'shape': shape,
                        'area': area,
                        'azimuth': azimuth
                    } : item))
            }));
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [props.inputs, activeId]);

    // create solar array objects for the polygons drawn on the map
    useEffect(() => {
        if (isEmpty) return;

        const polygonIds = polygons.map(p => p.id);

        // if no solar array is selected select one
        let isSelected = polygonIds.some((id) => id === activeId);
        if (!isSelected) setActiveId(polygonIds[0]);

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
                    shape: []
                }
            )
        });
        props.setInputs(prev => ({ ...prev, solarArrays: result }));
    }, [polygons])


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        type PropertyNames = 'solarCapacity' | 'numberOfPanels' | 'area' | 'azimuth' | 'areaToPanels';
        let name = e.target.name as PropertyNames;
        let value = e.target.value;

        if (name === 'areaToPanels' && e.target.checked) {
            name = 'numberOfPanels';
            // area of a panel is 1.8m2 and add 30% buffer
            let approxNumberofPanels = (solarArrays[activeIndex].area || 0) / 2.34;
            value = String(approxNumberofPanels.toFixed(0));
        }

        props.setInputs(prev => ({
            ...prev,
            solarArrays: solarArrays.map((item, i) =>
                (i === activeIndex ? { ...item, [name]: value === '' ? '' : Number(value) } : item))
        }));
    }

    const activeIndex = solarArrays.findIndex((sa) => sa.id === activeId);

    return (
        <div className="flex justify-evenly border-2 border-[#787572] rounded-xl p-6 gap-8 max-w-3xl mx-auto">
            <div className="flex-1 my-auto">
                <ol className="text-center font-[Space_Grotesk] space-y-2 py-3">
                    {solarArrays.map(({ id }, i) => {
                        return <li key={i}
                            className={`cursor-pointer ${activeId === id ? "text-[#DD6B19]" : ""}`}
                            onClick={() => setActiveId(id)}>
                            Solar array {id}
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
                        value={solarArrays[activeIndex]?.solarCapacity || ''}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false"
                        disabled={isEmpty}
                        required />
                </div>
                <div className="space-y-1">
                    <label className="text-center block" htmlFor="numberOfPanels">
                        Panel count
                    </label>
                    <input
                        name="numberOfPanels"
                        value={solarArrays[activeIndex]?.numberOfPanels || ''}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false"
                        disabled={isEmpty}
                        required />
                </div>
                <div className="space-y-1">
                    <label className="text-center block" htmlFor="azimuth">
                        Azimuth
                    </label>
                    <input
                        name="azimuth"
                        value={solarArrays[activeIndex]?.azimuth || ''}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false"
                        disabled={isEmpty}
                        required />
                </div>
                <div className="space-y-1">
                    <label className="text-center block" htmlFor="area">
                        Area
                    </label>
                    <input
                        name="area"
                        value={solarArrays[activeIndex]?.area || ''}
                        onChange={handleChange}
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                        type="number"
                        autoComplete="false"
                        disabled={isEmpty} />
                </div>
                <div className="col-span-2 space-x-1 mt">
                    <input className="accent-black" type="checkbox" name="areaToPanels" onChange={handleChange} />
                    <label>Use area to estimate number of panels</label>
                </div>
            </div>
        </div>
    )
}