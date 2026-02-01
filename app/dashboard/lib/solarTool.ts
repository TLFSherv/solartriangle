
// Sandia Cell Temperature Model
export function getCellTemps(poa: number[], ws: number[], aT: number[]) {
    // empirical coefficients based on module construction
    const a = -3.56, b = -0.075;
    // temp difference parameter between back surface and the cell
    const dT = 3;
    return poa.map((E, i) => E * Math.pow(Math.E, a + b * ws[i]) + aT[i] + (E / 1000) * dT);
}

export function getPowerOutputs(capacity: number, poa: number[], cT: number[]) {
    // temp coefficient of power, performance ratio not including temp
    const lmd = -0.0040, PR = 0.85;
    return poa.map((E, i) => E * capacity * PR * (1 + lmd * Math.max(cT[i] - 25, 0)));
}

export function getEnergyLosses(area: number, poa: number[], cT: number[]) {
    const stdEff = 0.2, lmd = -0.0040;
    return poa.map((E, i) => (E * area * stdEff) * Math.abs(lmd * Math.max(cT[i] - 25, 0)));
}

export function reduceDataByMonth(data: number[]) {
    // get the number of days in each month of the year
    const daysPerMonth = new Array(12).fill(0).map((_, index) => new Date(2025, index + 1, 0).getDate())
    const monthlyData: number[] = [];
    let start = 0;
    // sum all the data in one month
    daysPerMonth.forEach((days, i) => {
        start += daysPerMonth[i - 1] * 24 || 0;
        let result = data.slice(start, start + days * 24).reduce((acc, cur) => acc + cur);
        monthlyData.push(Math.round(result));
    });
    return monthlyData;
}

