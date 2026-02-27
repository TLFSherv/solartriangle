"use client"
import React, { useEffect } from "react";
import { CalculatorData } from "@/app/types/types"

export default function SolarArrayForm({ inputs, setInputs, activeId, setActiveId }: {
    inputs: CalculatorData,
    setInputs: React.Dispatch<React.SetStateAction<CalculatorData>>
    activeId: number,
    setActiveId: React.Dispatch<React.SetStateAction<number>>
}) {
    const { solarArrays } = inputs;
    let isEmpty = solarArrays.length === 0;
    let activeIndex = 0;

    useEffect(() => {
        if (isEmpty) activeIndex = 0;
        else activeIndex = solarArrays.findIndex((sa) => sa.id === activeId);
    }, [activeId])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let name = e.target.name;
        let value = e.target.value;

        if (name === 'areaToQuantity' && e.target.checked) {
            // area of a panel is 1.8m2 also include 30% buffer
            let panelCountEstimate = (solarArrays[activeIndex].area || 0) / 2.34;
            const newSolarArrays = {
                ...solarArrays[activeIndex],
                quantity: Math.round(panelCountEstimate),
                areaToQuantity: e.target.checked
            }
            setInputs(prev => ({
                ...prev,
                solarArrays: prev.solarArrays.map((item, i) => i === activeIndex ? newSolarArrays : item)
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
        <div className="space-y-4">
            <p className="text-sm sm:text-lg">
                Select the name of the solar array below to enter additional details about your solar panels:
            </p>
            <div className="flex justify-evenly border-2 border-[#787572] rounded-xl p-3 sm:p-6 gap-2 sm:gap-4 max-w-3xl mx-auto">
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
                <div className="flex-2 grid grid-cols-2 grid-rows-3 gap-x-3 gap-y-4 sm:gap-6 text-xs sm:text-sm max-h-[300px] my-auto">
                    <div className="space-y-1">
                        <label className="block text-center" htmlFor="solarCapacity">
                            Solar capacity
                        </label>
                        <input
                            name="capacity"
                            value={solarArrays[activeIndex]?.capacity ?? 0}
                            onChange={handleChange}
                            className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                            type="number"
                            min={50}
                            max={1000}
                            autoComplete="false"
                            disabled={isEmpty}
                            required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-center block" htmlFor="numberOfPanels">
                            Panel count
                        </label>
                        <input
                            name="quantity"
                            value={solarArrays[activeIndex]?.quantity ?? 0}
                            onChange={handleChange}
                            className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                            type="number"
                            min={1}
                            max={15}
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
                            value={solarArrays[activeIndex]?.azimuth ?? 0}
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
                            value={solarArrays[activeIndex]?.area ?? 0}
                            onChange={handleChange}
                            className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                            type="number"
                            min={1}
                            max={10000}
                            step={0.01}
                            autoComplete="false"
                            disabled={isEmpty} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-center block" htmlFor="azimuth">
                            Tilt
                        </label>
                        <input
                            name="tilt"
                            value={solarArrays[activeIndex]?.tilt ?? 30}
                            onChange={handleChange}
                            className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                            type="number"
                            min={0}
                            max={90}
                            step={0.1}
                            autoComplete="false"
                            disabled={isEmpty}
                            required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-center block" htmlFor="area">
                            Losses
                        </label>
                        <input
                            name="losses"
                            value={solarArrays[activeIndex]?.losses ?? 14}
                            onChange={handleChange}
                            className="py-1 px-2 border-2 border-[#444444] rounded-md w-full"
                            type="number"
                            min={1}
                            max={100}
                            step={1}
                            autoComplete="false"
                            disabled={isEmpty} />
                    </div>
                    <div className="col-span-2 space-x-1 mt">
                        <input
                            className="accent-black"
                            type="checkbox"
                            name="areaToQuantity"
                            onChange={handleChange}
                            checked={solarArrays[activeIndex]?.areaToQuantity || false}
                            disabled={isEmpty} />
                        <label className="">Use area to estimate number of panels</label>
                    </div>
                </div>
            </div>
        </div>
    )
}