'use client'

import { colors } from "../lib/dataTools"
import { useContext } from 'react';
import { CalculatorContext } from '../context/CalculatorProvider';
import { type CalculatorData } from "@/app/types/types";

export default function DataTable() {
    const calculatorData: CalculatorData = useContext(CalculatorContext);
    const bgColors = ['bg-[#2A5751]', 'bg-[#397ADB]', 'bg-[#4F6E9C]', 'bg-[#33312D]', 'bg-[#233331]'];
    return (
        <div className="flex flex-row justify-center">
            <table className="w-full sm:w-4/5 sm:text-lg text-left min-w-max text-gray-400 mx-4">
                <thead>
                    <tr>
                        <th className="border-b border-blue-gray-50">Name</th>
                        <th className="border-b border-blue-gray-50">Capacity</th>
                        <th className="border-b border-blue-gray-50">Quantity</th>
                        <th className="border-b border-blue-gray-50">Area</th>
                        <th className="border-b border-blue-gray-50">Azimuth</th>
                        <th className="border-b border-blue-gray-50">Color</th>
                    </tr>
                </thead>
                <tbody className="font-light">
                    {calculatorData.solarArrays.map((d, i) => {
                        console.log(bgColors[i])
                        return (<tr key={i}>
                            <td className="border-b border-blue-gray-50">Array {d.id}</td>
                            <td className="border-b border-blue-gray-50">{d.solarCapacity}</td>
                            <td className="border-b border-blue-gray-50">{d.numberOfPanels}</td>
                            <td className="border-b border-blue-gray-50">{d.area}</td>
                            <td className="border-b border-blue-gray-50">{d.azimuth}</td>
                            <td style={{ backgroundColor: colors[i] }} className='border-b border-blue-gray-50'></td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    );
}