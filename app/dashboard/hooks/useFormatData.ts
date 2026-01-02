import { useMemo } from "react";
import { poa_months, ac_months, time_week, gti_week, windSpeed_week, temp_week, cellTemp_year, poa_year, ac_year } from "../test-data/data";
import { getCellTemps, getPowerOutputs, getEnergyLosses, reduceDataByMonth } from "../lib/solarTool";
import { Dataset } from "../types/types";

export default function useFormatData(dataId: number, timeId: number[]) {
    // coord3 = timeId.length > 1 ? 1 : 0;
    // [dataId,timeId[0],coord3]
    // [0,0,0] -> kW/m2 | [0,0,1] -> W/m2 | [0,1,0] -> kW/m2 | [0,1,1] -> kW/m2 
    // [1,0,0] -> kW | [1,0,1] -> W | [1,1,0] -> kW | [1,1,1] -> kW
    // [2,0,0] -> W | [2,0,1] -> W | [2,1,0] -> kW | [2,1,1] -> W
    let isLevelTwo = timeId.length > 1;
    const names = [['poa kW/m2', 'poa W/m2'], ['power kW', 'power W'], ['losses kW', 'losses W']];
    let dataName = (timeId[0] === 0 && isLevelTwo) ? names[dataId][1] : names[dataId][0];
    if (dataId === 2) dataName = (timeId[0] === 1 && !isLevelTwo) ? names[dataId][0] : names[dataId][1];


    const data = useMemo(() => {
        const area = 10;
        const cellTemps = getCellTemps(gti_week, windSpeed_week, temp_week)
        const power_week = getPowerOutputs(area, gti_week, cellTemps);

        const losses_week = getEnergyLosses(area, gti_week, cellTemps);
        const losses_year = getEnergyLosses(area, poa_year, cellTemp_year);
        const losses_months = reduceDataByMonth(losses_year);

        return {
            week: [gti_week, power_week, losses_week],
            month: [poa_months, ac_months, losses_months,],
            year: [poa_year, ac_year, losses_year]
        };
    }, []);

    const result = useMemo(() => {
        const getDailyData = (): Dataset => {
            let prevDate: Date = new Date(time_week[0]);
            let dailyData: Dataset[] = Array(7).fill({ x: [], y: [], type: 'hrs', name: dataName });
            let start = 0;
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
            dailyData.forEach(({ x, y },) => {
                dailyDataTotals.x.push(x[0])
                let dailyTotal = y.reduce((acc, current) => acc + current)
                if (dataId !== 2) dailyTotal = Math.round(dailyTotal) / 1000;
                dailyDataTotals.y.push(dailyTotal);
            })

            return dailyDataTotals;
        }

        const getMonthlyData = (): Dataset => {
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
                if (dataId !== 2) dataDayTotal = Math.round(dataDayTotal) / 1000;
                dailyPoaByMonth.push(dataDayTotal);
                dayOfMonth.push(`${months[m]} ${i + 1}`);
            }
            return { x: dayOfMonth, y: dailyPoaByMonth, type: 'days', name: dataName };
        }
        return (timeId[0] === 0) ? getDailyData() : getMonthlyData()
    }, [timeId.join("-"), dataId])
    return result;
}
