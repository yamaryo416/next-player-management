import { useQuery } from "@apollo/client"

import { GET_MY_TEAM_FINISHED_SCHEDULES } from "../../queries"
import { MyTeamFinishedSchedulesType } from "../../../types/queriesType"

export const useGetMyTeamFinishedSchedules = () => {
    const {
        loading: loadingMyTeamFinishedSchedules,
        data: dataMyTeamFinishedSchedules,
        error: errorMyTeamFinishedSchedules,
    } = useQuery<MyTeamFinishedSchedulesType>(GET_MY_TEAM_FINISHED_SCHEDULES, {
        fetchPolicy: "cache-and-network"
    })

    return { loadingMyTeamFinishedSchedules, dataMyTeamFinishedSchedules, errorMyTeamFinishedSchedules }
}