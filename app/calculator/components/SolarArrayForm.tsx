"use client"
import React from "react";
import { FormInputs } from "@/app/types/types"

export default function SolarArrayForm({ inputs, setInputs, activeId, setActiveId }: {
    inputs: FormInputs,
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
    activeId: number,
    setActiveId: React.Dispatch<React.SetStateAction<number>>
}) {
    const { solarArrays } = inputs;
    let isEmpty = solarArrays.length === 0;
    let activeIndex: number;
    if (isEmpty) activeIndex = 0;
    else activeIndex = solarArrays.findIndex((sa) => sa.id === activeId);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let name = e.target.name;
        let value = e.target.value;

        if (name === 'areaToPanels' && e.target.checked) {
            // area of a panel is 1.8m2 also include 30% buffer
            let panelCountEstimate = (solarArrays[activeIndex].area || 0) / 2.34;
            const newSolarArrays = {
                ...solarArrays[activeIndex],
                numberOfPanels: Math.round(panelCountEstimate),
                areaToPanels: e.target.checked
            }
            setInputs(prev => ({
                ...prev,
                solarArrays: prev.solarArrays.map(item => item.id === activeIndex ? newSolarArrays : item)
            }));
            return
        }
        setInputs(prev => ({
            ...prev,
            solarArrays: solarArrays.map(item =>
                (item.id === activeId ? { ...item, [name]: value === '' ? '' : Number(value) } : item))
        }));
    }

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
                    <input
                        className="accent-black"
                        type="checkbox"
                        name="areaToPanels"
                        onChange={handleChange}
                        checked={solarArrays[activeIndex]?.areaToPanels || false} />
                    <label>Use area to estimate number of panels</label>
                </div>
            </div>
        </div>
    )
}