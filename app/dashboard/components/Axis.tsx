import { useMemo } from "react";
import * as d3 from "d3";

type Scale = {
    type: "x" | "y";
    domain: [number, number];
    range: [number, number];
}
export default function Axis({ type, domain, range }: Scale) {
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

    let height = 270;
    let pathShape, transform;
    let isX = type === "x";
    if (isX) {
        pathShape = `M ${range[0]} ${height + 6} v -6 H ${range[1]} v 6`;
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
                stroke="currentColor"
                strokeWidth="2"
            />
            {ticks.map(({ value, offset }) => (
                <g key={value}
                    transform={isX ?
                        `translate(${offset}, ${height})` :
                        `translate(4, ${range[1] + range[0] - offset})`}>
                    <line
                        y2={isX ? 6 : 0}
                        x2={isX ? 0 : 6}
                        stroke="currentColor" /> :
                    <text
                        key={value}
                        stroke="currentColor"
                        style={{
                            fontSize: "10px",
                            color: "white",
                            textAnchor: "middle",
                            transform
                        }}>
                        {value}
                    </text>
                </g>
            ))
            }
        </g >
    );
}