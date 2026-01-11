'use client'
import React from "react";
import * as d3 from "d3";
import Axis from "./Axis"
import useChartDimensions from "../hooks/useChartDimensions"

type ColorGradient = {
    offset: number;
    stopColor: string;
}[]

export default function HeatMap({ data, dataId, dataRanges, gradientProps }:
    {
        data: number[][],
        dataId: number,
        dataRanges: number[][],
        gradientProps: ColorGradient
    }) {
    const [ref, dms] = useChartDimensions({ width: 0, height: 0 });

    const position = { x: 0, y: 0 } // origin position
    const margin = { x: 8, y: 40 };
    const boundedWidth = dms.width - position.x - margin.x;

    const axisName = ['kWh/month', 'kWh/m2', '%']
    const xScale = d3.scaleLinear()
        .domain(dataRanges[dataId])
        .range([10, boundedWidth]);

    const colors = ['#2A5751', '#397ADB', '#4F6E9C', '#33312D', '#233331'];


    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="w-[90%] h-[140px] mx-auto">
            <svg width={dms.width} height={dms.height} >
                <defs>
                    <linearGradient id="Gradient1">
                        {gradientProps.map(color => <stop
                            key={color.offset}
                            offset={`${color.offset}%`}
                            stopColor={color.stopColor}
                        />
                        )}
                    </linearGradient>
                </defs>
                <g transform={`translate(${position.x},${position.y})`}>
                    <rect x="10" y="10" width={boundedWidth - 10} height={80} fill={"url(#Gradient1)"} />
                    {data.map((d, i) => <circle
                        key={i}
                        cx={xScale(d[dataId])}
                        cy={25 + 50 / data.length * i}
                        r="10"
                        stroke={colors[i]}
                        strokeWidth={4}
                        fill="none"
                        className="cursor-pointer"
                    />)}
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