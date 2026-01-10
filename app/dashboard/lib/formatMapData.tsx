export default function formatHeatMapData(data: any[]) {
    // get the number of days in each month of the year
    const daysPerMonth = new Array(12).fill(0).map((_, index) => new Date(2025, index + 1, 0).getDate())
    // get the ranges for ac_annual and solrad_annual
    let ac_range: number[] = [], solrad_range: number[] = [];
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

        return [d.pvwatts.outputs.ac_annual / 12,
        d.pvwatts.outputs.solrad_annual,
        d.pvwatts.outputs.capacity_factor];
    });

    const dataRanges = [
        [Math.min(...ac_range), Math.max(...ac_range)],
        [Math.min(...solrad_range), Math.max(...solrad_range)],
        [10, 25] // capacity factors range from 10% to 25%
    ];

    const cleanRanges: [number, number][] = dataRanges.map(range => {
        let multipleOfTen = Math.pow(10, Math.trunc(Math.log10(range[0])));
        const cleanStart = Math.trunc(range[0] / multipleOfTen) * multipleOfTen;

        multipleOfTen = Math.pow(10, Math.trunc(Math.log10(range[1])));
        const cleanEnd = Math.trunc(range[1] / multipleOfTen) * multipleOfTen;

        return [cleanStart, cleanEnd];
    });

    return [inputData, cleanRanges];
}