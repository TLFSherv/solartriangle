import React, { useEffect, useMemo } from "react";
import { poa_monthly, time_daily, gti_daily } from "../test-data/data";

function getDateIndexes(timeData: string[]): { end: number; day: number }[] {
    let date: Date;
    let prevDate: Date = new Date(timeData[0]);
    let indexDateRanges = [];
    for (let i = 0; i < timeData.length; ++i) {
        date = new Date(timeData[i]);
        if (date.getUTCDate() !== prevDate.getUTCDate())
            indexDateRanges.push({ end: i, day: prevDate.getUTCDay() });
        prevDate = date;
    }
    return indexDateRanges;
}
