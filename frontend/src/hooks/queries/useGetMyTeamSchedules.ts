import { useQuery } from "@apollo/client"

import { GET_MY_TEAM_SCHEDULES } from "../../queries"
import { MyTeamSchedulesType } from "../../../types/queriesType"

export const useGetMyTeamSchedules = () => {
    const {
        loading: loadingMyTeamSchedules,
        data: dataMyTeamSchedules,
        error: errorMyTeamSchedules,
    } = useQuery<MyTeamSchedulesType>(GET_MY_TEAM_SCHEDULES, {
        fetchPolicy: "cache-and-network"
    })

    return {
        loadingMyTeamSchedules,
        dataMyTeamSchedules,
        errorMyTeamSchedules,
    }
}