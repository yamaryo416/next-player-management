import { useCallback } from "react"
import moment, { Moment } from "moment"

export const useJapanDateTime = () => {
    const showJapanDateTime = useCallback(
        (dateTime: Moment, isDisplayYear: boolean) => {
            if (isDisplayYear) return moment.utc(dateTime).local().format("YYYY年M月D日 H時m分")
            else return moment.utc(dateTime).local().format("M月D日 H時m分")
    }, [])

    return { showJapanDateTime }
}