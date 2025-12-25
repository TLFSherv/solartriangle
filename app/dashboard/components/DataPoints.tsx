import * as d3 from "d3";

type DataPoints =
    {
        dataset: Dataset;
        settings: { height: number; width: number };
        domain: { x: [Date, Date] | [number, number]; y: [number, number] };
        range: { x: [number, number]; y: [number, number] };
    }
type Dataset = {
    x: string[] | number[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
}
export default function DataPoints(props: DataPoints) {
    const { dataset, settings, domain, range } = props;
    let xScale: d3.ScaleLinear<number, number, never> | d3.ScaleTime<number, number, never>;
    if (dataset.type === 'months')
        xScale = d3.scaleLinear()
            .domain(domain.x)
            .range(range.x);
    else
        xScale = d3.scaleUtc()
            .domain(domain.x)
            .range(range.x);

    const yScale = d3.scaleLinear()
        .domain(domain.y)
        .range(range.y);

    return (
        <g>
            {dataset.x.map((x, i) => (
                <circle
                    key={i}
                    cx={(dataset.type === 'months') ? xScale(x as number) : xScale(new Date(x))}
                    cy={settings.height - yScale(dataset.y[i]) + range.y[0]}
                    r="3"
                    fill="white"
                />
            ))}
        </g>
    )
}