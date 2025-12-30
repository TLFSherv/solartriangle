import { useEffect, useMemo } from "react";
import { poa_monthly, time_daily, gti_daily, poa_hourly, temperature, wind_speed } from "../test-data/data";
import { getPowerOutput, getPanelLosses } from "../lib/solarTool";
import { Dataset } from "../types/types";

export default function useFormatData(dataId: number, timeId: number[]) {
    let dataName;
    if (dataId === 0) dataName = 'poa W/m2';
    else if (dataId === 1) dataName = 'power W';
    else dataName = 'losses %';

    const data = useMemo(() => {
        const area = 10;
        const power_daily = getPowerOutput(area, gti_daily, wind_speed, temperature);
        const losses_daily = getPanelLosses(gti_daily, wind_speed, temperature);
        return [gti_daily, power_daily, losses_daily];
    }, []);

    const result = useMemo(() => {
        const getDataByDay = (): Dataset => {
            let prevDate: Date = new Date(time_daily[0]);
            let hourlyData: Dataset[] = Array(7).fill({ x: [], y: [], type: 'hrs', name: dataName });
            let start = 0;
            // group data by date
            for (let i = 0; i < time_daily.length; ++i) {
                let date = new Date(time_daily[i]);
                if (date.getUTCDate() !== prevDate.getUTCDate()) {
                    hourlyData[prevDate.getUTCDay()] = {
                        x: time_daily.slice(start, i),
                        y: data[dataId].slice(start, i),
                        type: 'hrs',
                        name: dataName
                    };
                    start = i;
                }
                prevDate = date;
            }
            if (timeId.length > 1) return hourlyData[timeId[1]];

            let dailyData: Dataset = { x: [], y: [], type: "days", name: dataName };
            hourlyData.forEach(({ x, y }) => {
                dailyData.x.push(x[0])
                const dailyTotal = y.reduce((acc, current) => acc + current)
                dailyData.y.push(Math.round(dailyTotal))
            })
            return dailyData;
        }

        const getDataByMonth = (): Dataset => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (timeId.length === 1) return { x: months, y: poa_monthly, type: "months", name: dataName }
            // get the number of days in each month of the year
            const daysPerMonth = new Array(12).fill(0).map((_, index) => new Date(2025, index + 1, 0).getDate())
            let hourlyPoaByMonth: number[][] = [];

            // parse array to get poa values per month
            let initialValue = 0, totalHrs = 0;
            daysPerMonth.forEach(days => {
                totalHrs += days * 24;
                hourlyPoaByMonth.push(poa_hourly.slice(initialValue, totalHrs));
                initialValue = totalHrs;
            })
            // sum the poa for each day in each month
            let dailyPoaByMonth: number[] = [];
            let dayOfMonth: string[] = [];
            const m = timeId[1];
            const poaHrs = hourlyPoaByMonth[m];
            let poaDayTotal = 0;
            for (let i = 0; i < daysPerMonth[m]; ++i) {
                poaDayTotal = poaHrs.slice(i * 24, 24 * (i + 1)).reduce((a, b) => a + b);
                dailyPoaByMonth.push(Math.round(poaDayTotal))
                dayOfMonth.push(`${months[m]} ${i + 1}`);
            }

            return { x: dayOfMonth, y: dailyPoaByMonth, type: 'days', name: dataName };
        }
        return (timeId[0] === 0) ? getDataByDay() : getDataByMonth()
    }, [timeId.join("-"), dataId])
    return result;
}
