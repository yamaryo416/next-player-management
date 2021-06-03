import { useQuery } from "@apollo/client"

import { GET_ALL_TEAM_BOARD } from "../../queries"
import { AllTeamBoardType } from "../../../types/queriesType"

export const useGetAllTeamBoard = () => {
    const { 
        loading: loadingAllTeamBoard,
        data: dataAllTeamBoard,
        error: errorAllTeamBoard,
    } = useQuery<AllTeamBoardType>(GET_ALL_TEAM_BOARD, {
        fetchPolicy: "cache-and-network",
    })

    return {
        loadingAllTeamBoard,
        dataAllTeamBoard,
        errorAllTeamBoard
    }
}