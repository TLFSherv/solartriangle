import GoogleMap from "./GoogleMap";
import HeatMap from "./HeatMap";

export default function Map({ data }: { data: any[] }) {
    const inputData = data.map(d => [d.pvwatts.outputs.ac_annual,
    d.pvwatts.outputs.solrad_annual,
    d.pvwatts.outputs.capacity_factor
    ]) as number[][];
    return (
        <div>
            <GoogleMap />
            <HeatMap data={inputData} />
        </div>
    )
}