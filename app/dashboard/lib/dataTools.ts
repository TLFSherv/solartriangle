import { useMemo } from "react";
import { getCellTemps, getPowerOutputs, getEnergyLosses, reduceDataByMonth } from "./solarTool";
import { Dataset } from "../../types/types";
import * as d3 from "d3";

export function formatDataChart(inputData: any[], dataId: number, timeId: number[]): Dataset[] {
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
            week: [Array.from(gti_week), Array.from(power_week), Array.from(losses_week)],
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

export function formatDataMap(data: any[]) {
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

export function getDataColors(data: any[][], dataId: number, dataRanges: number[][]) {
    const dataColors: string[] = [];
    data.forEach(d => {
        const value = 100 * ((d[dataId] - dataRanges[dataId][0]) / (dataRanges[dataId][1] - dataRanges[dataId][0]));
        const id = gradientProps.findIndex(color => value < color.offset);
        console.log(id - 1)
        const { offset: d1, stopColor: r1 } = gradientProps[id - 1];
        const { offset: d2, stopColor: r2 } = gradientProps[id];

        const colorScale = d3.scaleLinear([d1, d2], [r1, r2]);
        dataColors.push(colorScale(value));
    });
    return dataColors;
}

export const gradientProps = [
    { offset: 0, stopColor: "#02020C" },
    { offset: 16, stopColor: "#41006A" },
    { offset: 32, stopColor: "#911A6B" },
    { offset: 48, stopColor: "#E7434C" },
    { offset: 54, stopColor: "#E4404E" },
    { offset: 70, stopColor: "#F05C4E" },
    { offset: 86, stopColor: "#FCC37E" },
    { offset: 100, stopColor: "#FBFFB2" },
];

export const colors = ['#2A5751', '#397ADB', '#4F6E9C', '#33312D', '#233331'];