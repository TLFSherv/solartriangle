import { useMemo } from "react";
import * as d3 from "d3";

type Axis = {
    type: "x" | "y";
    name: string;
    domain: [number, number];
    range: [number, number];
}
export default function Axis({ type, name, domain, range }: Axis) {

    const x = d3.scaleUtc([new Date("2025-12-18T00:00:00.000Z"),
    new Date("2025-12-27T23:00:00.000Z")], [0, 632]);

    const ticks = useMemo(() => {
        const axisScale = d3.scaleLinear()
            .domain(domain)
            .range(range);

        const width = range[1] - range[0];
        const pixelsPerTick = 30;
        const numberOfTicksTarget = Math.max(
            1,
            Math.floor(
                width / pixelsPerTick
            )
        )

        return axisScale.ticks(numberOfTicksTarget)
            .map(value => ({
                value,
                offset: axisScale(value)
            }))
    }, [domain.join("-"), range.join("-")]);

    let pathShape, transform;
    let isX = type === "x";
    let rangeTotal = range[0] + range[1];
    if (isX) {
        pathShape = `M ${range[0]} 6 v -6 H ${range[1]} v 6`;
        transform = "translateY(20px)";
    } else {
        pathShape = `M ${range[0]} ${range[0]} V ${range[1]}`;
        transform = "translate(-10px, 2px)";
    }

    return (
        <g>
            <path
                d={pathShape}
                fill="none"
                stroke="#444444"
                strokeWidth="2"
            />
            {ticks.map(({ value, offset }) => (
                <g key={value}
                    transform={isX ?
                        `translate(${offset}, 0)` :
                        `translate(4, ${rangeTotal - offset})`}>
                    <line
                        y2={isX ? 6 : 0}
                        x2={isX ? 0 : 6}
                        stroke="#6E6E6E" /> :
                    <text
                        key={value}
                        stroke="currentColor"
                        style={{
                            fontSize: "10px",
                            color: "#FFFFFF",
                            textAnchor: "middle",
                            transform
                        }}>
                        {value}
                    </text>
                </g>
            ))
            }
            <g transform={isX ? `translate(${rangeTotal / 2}, 39)` :
                `rotate(-90,-30,${rangeTotal / 2}) translate(-10, ${rangeTotal / 2})`}>
                <text
                    stroke="currentColor"
                    style={{
                        fontSize: "11px",
                        color: "#FFFFFF",
                        textAnchor: "middle",
                        letterSpacing: "0.05em",
                    }}>
                    {name}
                </text>
            </g>
        </g >
    );
}