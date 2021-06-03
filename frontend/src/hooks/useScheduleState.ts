import { ChangeEvent, useCallback, useState } from "react"

import { TODAY } from "../../constants"

export const useScheduleState = () => {
    const [isSingleSchedule, setIsSingleSchedule] = useState(true)
    const [dayOfWeek, setDayOfWeek] = useState("0123456")

    const includeWeekDays = useCallback((i: number): boolean => dayOfWeek.includes(i.toString()), [dayOfWeek])

    const onClickChangeMode = useCallback(() => setIsSingleSchedule(!isSingleSchedule), [isSingleSchedule])
    const onChangeDayOfWeek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const day = Number(e.target.value)
        includeWeekDays(day) ? setDayOfWeek(dayOfWeek.replace(day.toString(), "")) : setDayOfWeek(dayOfWeek + day.toString())
    }, [dayOfWeek])

    return ({ 
        isSingleSchedule,
        dayOfWeek,
        setDayOfWeek,
        includeWeekDays,
        onClickChangeMode,
        onChangeDayOfWeek,
    })
}