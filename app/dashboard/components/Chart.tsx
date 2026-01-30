'use client'
import { useState, useContext } from "react";
import { formatChartData } from "../lib/dataTools";
import ChartData from "./ChartData";
import ChartMenu from "./ChartMenu";
import { CalculatorContext } from '../context/CalculatorProvider';
import { type CalculatorData } from "@/app/types/types";


export default function Chart({ data }:
    { data: any[] }) {
    const [dataId, setDataId] = useState<number>(0);
    const [timeId, setTimeId] = useState<number[]>([0]);
    const calculatorData: CalculatorData = useContext(CalculatorContext);
    const dataset = formatChartData(data, calculatorData, dataId, timeId);

    return (
        <div className="w-full text-center">
            <ChartMenu
                dataId={dataId}
                setDataId={setDataId}
                timeId={timeId}
                setTimeId={setTimeId} />
            <ChartData dataset={dataset} />
        </div>
    );
}