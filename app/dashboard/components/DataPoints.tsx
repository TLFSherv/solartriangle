import * as d3 from "d3";

type DataPoints =
    {
        dataset: Dataset;
        settings: { height: number; width: number };
        domain: { x: [Date, Date] | [number, number]; y: [number, number] };
        range: { x: [number, number]; y: [number, number] };
    }
type Dataset = {
    x: string[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
}
export default function DataPoints(props: DataPoints) {
    const { dataset, settings, domain, range } = props;
    let yCoord = 0, points = "";
    const xScale = d3.scaleLinear()
        .domain(domain.x)
        .range(range.x);
    const yScale = d3.scaleLinear()
        .domain(domain.y)
        .range(range.y);

    return (
        <g>
            {dataset.y.map((y, i) => {
                yCoord = settings.height - yScale(y) + range.y[0];
                points += `${xScale(i)}, ${yCoord} `;
                return <circle
                    key={i}
                    cx={xScale(i)}
                    cy={yCoord}
                    r="3"
                    fill="white"
                />
            })}
            <polyline points={points} fill="none" stroke="white" />
        </g>

    )
}