import { useQuery } from "@apollo/client"
import { useRecoilValue } from "recoil"

import { GET_ONE_DAY_SCHEDULES } from "../../queries"
import { scheduleOneDayState } from "../../store/scheduleOneDayState"
import { MyTeamSchedulesType } from "../../../types/queriesType"

export const useGetOneDaySchedules = () => {
    const oneDay = useRecoilValue(scheduleOneDayState)

    const { 
        loading: loadingOnedaySchedules,
        data: dataOneDaySchedules,
        error: errorOneDaySchedules,
    } = useQuery<MyTeamSchedulesType>(GET_ONE_DAY_SCHEDULES, {
        fetchPolicy: "cache-and-network",
        variables: { date: oneDay },
    })

    return {
        loadingOnedaySchedules,
        dataOneDaySchedules,
        errorOneDaySchedules,
    }
}