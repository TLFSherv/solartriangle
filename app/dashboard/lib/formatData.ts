import { useMemo } from "react";
import { getCellTemps, getPowerOutputs, getEnergyLosses, reduceDataByMonth } from "./solarTool";
import { Dataset } from "../types/types";

export default function formatData(inputData: any[], dataId: number, timeId: number[]): Dataset[] {
    const selectedOnce = timeId.length === 1;
    const check1 = (timeId[0] !== 0 || selectedOnce); // conditions to use kWh for Power and Irradiance data
    const check2 = (dataId === 2 && timeId[0] === 1 && selectedOnce); // conditons for using kWh for Losses data
    const check3 = check1 && dataId !== 2;
    const names = [['poa kW/m2', 'poa W/m2'], ['power kW', 'power W'], ['losses kW', 'losses W']];
    let dataName = check1 ? names[dataId][0] : names[dataId][1];
    if (dataId === 2) dataName = check2 ? names[dataId][0] : names[dataId][1];

    const time_week = inputData[0].openmeteo.hourly.time;
    const data = useMemo(() => inputData.map(d => {
        const {
            global_tilted_irradiance: gti_week,
            wind_speed_10m: windSpeed_week,
            temperature_2m: temp_week } = d.openmeteo.hourly;

        const {
            ac_monthly,
            poa_monthly,
            tamb: cellTemp_year,
            poa: poa_year,
            ac: ac_year
        } = d.pvwatts.outputs;

        const area = 10;
        const cellTemps = getCellTemps(gti_week, windSpeed_week, temp_week)
        const power_week = getPowerOutputs(area, gti_week, cellTemps);

        const losses_week = getEnergyLosses(area, gti_week, cellTemps);
        const losses_year = getEnergyLosses(area, poa_year, cellTemp_year);
        const losses_monthly = reduceDataByMonth(losses_year).
            map(d => check2 ? d / 1000 : d);

        return {
            week: [gti_week, power_week, losses_week],
            month: [poa_monthly, ac_monthly, losses_monthly,],
            year: [poa_year, ac_year, losses_year]
        };
    }), []);

    const result = useMemo(() => {
        const getDailyData = (data:
            {
                week: any[];
                month: any[];
                year: any[];
            }): Dataset => {
            let prevDate: Date = new Date(time_week[0]);
            let dailyData: Dataset[] = Array(7).fill({ x: [], y: [], type: 'hrs', name: dataName });
            let start = 0;
            console.log(dailyData);
            // group data by date
            for (let i = 0; i < time_week.length; ++i) {
                let date = new Date(time_week[i]);
                if (date.getUTCDate() !== prevDate.getUTCDate()) {
                    dailyData[prevDate.getUTCDay()] = {
                        x: time_week.slice(start, i),
                        y: data.week[dataId].slice(start, i) as number[],
                        type: 'hrs',
                        name: dataName
                    };
                    start = i;
                }
                prevDate = date;
            }
            if (timeId.length > 1) return dailyData[timeId[1]];

            let dailyDataTotals: Dataset = { x: [], y: [], type: "days", name: dataName };
            let dailyTotal = 0;

            dailyData.forEach(({ x, y },) => {
                dailyDataTotals.x.push(x[0])
                dailyTotal = y.reduce((acc, cur) => acc + cur)
                dailyDataTotals.y.push((check2 || check3) ? Math.round(dailyTotal) / 1000 : dailyTotal);
            })
            return dailyDataTotals;
        }

        const getMonthlyData = (
            data: {
                week: any[];
                month: any[];
                year: any[];
            }): Dataset => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (timeId.length === 1) return { x: months, y: data.month[dataId], type: "months", name: dataName }
            // get the number of days in each month of the year
            const daysPerMonth = new Array(12).fill(0).map((_, index) => new Date(2025, index + 1, 0).getDate())
            let monthlyData: number[][] = [];

            // parse array to get values per month
            let initialValue = 0, totalHrs = 0;
            daysPerMonth.forEach(days => {
                totalHrs += days * 24;
                monthlyData.push(data.year[dataId].slice(initialValue, totalHrs));
                initialValue = totalHrs;
            })
            // sum the hourly data to get total for each day of each month
            let dailyPoaByMonth: number[] = [];
            let dayOfMonth: string[] = [];
            const m = timeId[1];
            let dataDayTotal = 0;
            for (let i = 0; i < daysPerMonth[m]; ++i) {
                dataDayTotal = monthlyData[m].slice(i * 24, (i + 1) * 24).reduce((a, b) => a + b);
                dailyPoaByMonth.push((check2 || check3) ? Math.round(dataDayTotal) / 1000 : dataDayTotal);
                dayOfMonth.push(`${months[m]} ${i + 1}`);
            }
            return { x: dayOfMonth, y: dailyPoaByMonth, type: 'days', name: dataName };
        }

        return data.map(d => (timeId[0] === 0) ? getDailyData(d) : getMonthlyData(d));
    }, [timeId.join("-"), dataId])

    return result;
}
