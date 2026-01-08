import { ac_annual, capacity_factor, solrad_annual } from "../test-data/data";
import GoogleMap from "./GoogleMap";
import HeatMap from "./HeatMap";

export default function Map({ data }: { data: any[] }) {
    // get the number of days in each month of the year
    const daysPerMonth = new Array(12).fill(0).map((_, index) => new Date(2025, index + 1, 0).getDate())
    // get the ranges for ac_annual and solrad_annual
    let ac_range: number[] = [];
    let solrad_range: number[] = [];
    let capacity_factor_range = [10, 25]
    let minMonth = 0, maxMonth = 0;
    const inputData = data.map((d, i) => {
        ac_range.push(
            Math.min(...d.pvwatts.outputs.ac_monthly),
            Math.max(...d.pvwatts.outputs.ac_monthly)
        );

        minMonth = d.pvwatts.outputs.ac_monthly.indexOf(ac_range[2 * i]);
        maxMonth = d.pvwatts.outputs.ac_monthly.indexOf(ac_range[2 * i + 1]);

        solrad_range.push(
            Math.min(...d.pvwatts.outputs.poa_monthly) / daysPerMonth[minMonth],
            Math.max(...d.pvwatts.outputs.poa_monthly) / daysPerMonth[maxMonth]
        );

        return [d.pvwatts.outputs.ac_annual,
        d.pvwatts.outputs.solrad_annual,
        d.pvwatts.outputs.capacity_factor];
    });

    const dataRanges = [
        [Math.min(...ac_range) * 12, Math.max(...ac_range) * 12],
        [Math.min(...solrad_range), Math.max(...solrad_range)],
        capacity_factor_range
    ];

    return (
        <div>
            <GoogleMap />
            <HeatMap data={inputData} dataRanges={dataRanges} />
        </div>
    )
}