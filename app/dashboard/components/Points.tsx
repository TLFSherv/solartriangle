import { useState } from "react";
import * as d3 from "d3";

type PointsParams =
    {
        settings: { height: number; width: number };
        domain: { x: [number, number]; y: [number, number] };
        range: { x: [number, number]; y: [number, number] };
    }
export default function Points(props: PointsParams) {
    const { settings, domain, range } = props;
    const testdata = [[10, 10], [20, 20], [30, 30], [40, 40], [50, 50], [60, 60], [70, 70]];
    const [dataset, setDataSet] = useState(testdata);

    const xScale = d3.scaleLinear()
        .domain(domain.x)
        .range(range.x);
    const yScale = d3.scaleLinear()
        .domain(domain.y)
        .range(range.y);

    return (
        <g>
            {dataset.map(([x, y], i) => (
                <circle
                    key={i}
                    cx={xScale(x)}
                    cy={settings.height - yScale(y) + range.y[0]}
                    r="3"
                    fill="white"
                />
            ))}
        </g>
    )
}