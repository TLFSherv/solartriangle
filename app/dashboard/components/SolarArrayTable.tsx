'use client'

import { colors } from "../lib/dataTools"
import { useContext } from 'react';
import { CalculatorContext } from '../context/CalculatorProvider';
import { type CalculatorData } from "@/app/types/types";

export default function SolarArrayTable() {
    const calculatorData: CalculatorData = useContext(CalculatorContext);
    return (
        <div className="flex flex-row font-[Darker_Grotesque] overflow-auto whitespace-nowrap w-[90%] mx-auto">
            <table className="w-full mx-auto sm:w-4/5 text-lg sm:text-2xl text-left min-w-max text-gray-300">
                <thead>
                    <tr>
                        <th className="border-b border-blue-gray-50 px-2">Name</th>
                        <th className="border-b border-blue-gray-50 px-2">Capacity</th>
                        <th className="border-b border-blue-gray-50 px-2">Quantity</th>
                        <th className="border-b border-blue-gray-50 px-2">Area</th>
                        <th className="border-b border-blue-gray-50 px-2">Azimuth</th>
                        <th className="border-b border-blue-gray-50 px-2">Tilt</th>
                        <th className="border-b border-blue-gray-50 px-2">Losses</th>
                    </tr>
                </thead>
                <tbody className="font-light">
                    {calculatorData.solarArrays.map((d, i) => {
                        return (<tr key={i}>
                            <td style={{ backgroundColor: colors[i] }} className="border-b border-blue-gray-50 px-2">Array {d.id}</td>
                            <td className="border-b border-blue-gray-50 px-2">{d.capacity}</td>
                            <td className="border-b border-blue-gray-50 px-2">{d.quantity}</td>
                            <td className="border-b border-blue-gray-50 px-2">{d.area}</td>
                            <td className="border-b border-blue-gray-50 px-2">{d.azimuth}</td>
                            <td className="border-b border-blue-gray-50 px-2">{d.tilt}</td>
                            <td className="border-b border-blue-gray-50 px-2">{d.losses}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    );
}