import * as d3 from "d3";

type PointsParams =
    {
        dataset: Dataset;
        settings: { height: number; width: number };
        domain: { x: [number, number]; y: [number, number] };
        range: { x: [number, number]; y: [number, number] };
    }
type Dataset = {
    x: number[];
    y: number[];
    type: 'monthly' | 'hourly' | 'daily';
}
export default function Points(props: PointsParams) {
    const { dataset, settings, domain, range } = props;
    //const [dataset, setDataSet] = useState(testdata);

    const xScale = d3.scaleLinear()
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
                    cx={xScale(x)}
                    cy={settings.height - yScale(dataset.y[i]) + range.y[0]}
                    r="3"
                    fill="white"
                />
            ))}
        </g>
    )
}