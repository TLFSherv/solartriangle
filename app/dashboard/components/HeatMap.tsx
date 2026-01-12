'use client'
import React, { useState } from "react";
import * as d3 from "d3";
import Axis from "./Axis"
import useChartDimensions from "../hooks/useChartDimensions"
import { colors } from '../lib/dataTools'
import { ColorGradient } from '../types/types'


export default function HeatMap({ data, dataId, dataRanges, gradientProps }:
    {
        data: number[][],
        dataId: number,
        dataRanges: number[][],
        gradientProps: ColorGradient
    }) {
    const [selectedPoint, setSelectedPoint] = useState(0)
    const [ref, dms] = useChartDimensions({ width: 0, height: 0 });

    const position = { x: 0, y: 0 } // origin position
    const margin = { x: 8, y: 40 };
    const boundedWidth = dms.width - position.x - margin.x;

    const axisName = ['kWh/month', 'kWh/m2', '%']
    const xScale = d3.scaleLinear()
        .domain(dataRanges[dataId])
        .range([10, boundedWidth]);

    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="w-[90%] h-[140px] mx-auto">
            <svg width={dms.width} height={dms.height} >
                <defs>
                    <linearGradient id="Gradient1">
                        {gradientProps.map(color => <stop
                            key={color.offset}
                            offset={`${color.offset}%`}
                            stopColor={color.stopColor}
                        />)}
                    </linearGradient>
                </defs>
                <g transform={`translate(${position.x},${position.y})`}>
                    <rect x="10" y="10" width={boundedWidth - 10} height={80} fill={"url(#Gradient1)"} />
                    {data.map((d, i) => <g key={i}>
                        <circle
                            cx={xScale(d[dataId])}
                            cy={25 + 50 / data.length * i}
                            r="10"
                            stroke={colors[i]}
                            strokeWidth={4}
                            fill="none"
                            className="cursor-pointer"
                            onClick={() => setSelectedPoint(i)}
                        />
                        {(selectedPoint === i) && <text
                            fill="white"
                            x={xScale(d[dataId]) + 16}
                            y={25 + 50 / data.length * i}
                            className="text-xs">
                            {d[dataId].toFixed(2)}
                        </text>}
                    </g>
                    )}
                    <g transform={`translate(0,${90})`}>
                        <Axis
                            type="x"
                            name={axisName[dataId]}
                            domain={dataRanges[dataId] as [number, number]}
                            range={[10, boundedWidth]}
                        />
                    </g>
                </g>
            </svg>
        </div>
    )
}