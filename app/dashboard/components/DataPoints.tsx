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
    console.log(domain.x)
    const xScale = d3.scaleLinear()
        .domain(domain.x)
        .range(range.x);
    const yScale = d3.scaleLinear()
        .domain(domain.y)
        .range(range.y);

    return (
        <g>
            {dataset.y.map((y, i) => (
                <circle
                    key={i}
                    cx={xScale(i)}
                    cy={settings.height - yScale(y) + range.y[0]}
                    r="3"
                    fill="white"
                />
            ))}
        </g>
    )
}