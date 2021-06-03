import { useCallback } from "react";
import moment from "moment";
import { useRecoilState } from "recoil";

import { calendarDateState } from "../store/calendarDateState";
import { FIRSTDATE } from "../../constants";
import { scheduleOneDayState } from "../store/scheduleOneDayState";

export const useCalendar = () => {
    const [oneDay, setOneDay] = useRecoilState(scheduleOneDayState)
    const [calendarDate, setCalendarDate] = useRecoilState(calendarDateState)

    const onClickPreviousDate = useCallback(() => {
        setOneDay(moment(oneDay).add(-1, 'days').format("YYYY-MM-DD"))
    }, [oneDay])

    const onClickNextDate = useCallback(() => {
        setOneDay(moment(oneDay).add(1, 'days').format("YYYY-MM-DD"))
    }, [oneDay])
        
    const onClickLastWeek = useCallback(() => {
        setCalendarDate({
            ...calendarDate, 
            firstDate: moment(calendarDate.firstDate).add(-1, "w"),
            todayDiff: calendarDate.todayDiff - 1
        })
    }, [calendarDate])
    const onClickThisWeek = useCallback(() => {
        setCalendarDate({
            ...calendarDate, 
            firstDate: FIRSTDATE,
            todayDiff: 0
        })
    }, [calendarDate])
    const onClickNextWeek = useCallback(() => {
        setCalendarDate({
            ...calendarDate, 
            firstDate: moment(calendarDate.firstDate).add(1, "w"),
            todayDiff: calendarDate.todayDiff + 1
        })
    }, [calendarDate])

    return ({
        onClickPreviousDate,
        onClickNextDate,
        onClickLastWeek,
        onClickThisWeek,
        onClickNextWeek,
    })
}