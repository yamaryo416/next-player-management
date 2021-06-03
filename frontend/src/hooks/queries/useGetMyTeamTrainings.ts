import { useQuery } from "@apollo/client"

import { GET_MY_TEAM_TRAININGS } from "../../queries"
import { MyTeamTrainingsType } from "../../../types/queriesType"

export const useGetMyTeamTrainings = () => {
    const { loading: loadingMyTeamTrainings, data: dataMyTeamTrainings, error: errorMyTeamTrainings } = useQuery<MyTeamTrainingsType>(GET_MY_TEAM_TRAININGS, {
        fetchPolicy: "cache-and-network",
    })

    return {
        loadingMyTeamTrainings,
        dataMyTeamTrainings,
        errorMyTeamTrainings
    }
}