import { useMemo } from "react";
import { poa_monthly, time_daily, gti_daily, poa_hourly } from "../test-data/data";

type Dataset = {
    x: string[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
}
export default function useFormatData(selected: number[]) {
    const result = useMemo(() => {
        const getDataByDay = (): Dataset => {
            let prevDate: Date = new Date(time_daily[0]);
            let hourlyData: Dataset[] = Array(7).fill({ x: [], y: [], type: 'hrs' });
            let start = 0;
            // group data by date
            for (let i = 0; i < time_daily.length; ++i) {
                let date = new Date(time_daily[i]);
                if (date.getUTCDate() !== prevDate.getUTCDate()) {
                    hourlyData[prevDate.getUTCDay()] = {
                        x: time_daily.slice(start, i),
                        y: gti_daily.slice(start, i),
                        type: 'hrs'
                    };
                    start = i;
                }
                prevDate = date;
            }
            if (selected.length > 1) return hourlyData[selected[1]];

            let dailyData: Dataset = { x: [], y: [], type: "days" };
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
            if (selected.length === 1) return { x: months, y: poa_monthly, type: "months" }
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
            const m = selected[1];
            const poaHrs = hourlyPoaByMonth[m];
            let poaDayTotal = 0;
            for (let i = 0; i < daysPerMonth[m]; ++i) {
                poaDayTotal = poaHrs.slice(i * 24, 24 * (i + 1)).reduce((a, b) => a + b);
                dailyPoaByMonth.push(Math.round(poaDayTotal))
                dayOfMonth.push(`${months[m]} ${i + 1}`);
            }

            return { x: dayOfMonth, y: dailyPoaByMonth, type: 'days' };
        }
        return (selected[0] === 0) ? getDataByDay() : getDataByMonth()
    }, [selected.join("-")])
    return result;
}
