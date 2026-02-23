'use client'

import { colors } from "../lib/dataTools"
import { useContext } from 'react';
import { CalculatorContext } from '../context/CalculatorProvider';
import { type CalculatorData } from "@/app/types/types";

export default function SolarArrayTable() {
    const calculatorData: CalculatorData = useContext(CalculatorContext);
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
                        return (<tr key={i}>
                            <td className="border-b border-blue-gray-50">Array {d.id}</td>
                            <td className="border-b border-blue-gray-50">{d.capacity}</td>
                            <td className="border-b border-blue-gray-50">{d.quantity}</td>
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