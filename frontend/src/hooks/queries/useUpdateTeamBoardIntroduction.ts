import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { GET_MY_PROFILE, UPDATE_TEAM_BOARD_INTRODUCTION } from "../../queries"

export const useUpdateTeamBoardIntroduction = () => {
    const [updateTeamBoardIntroductionMutation] = useMutation(UPDATE_TEAM_BOARD_INTRODUCTION)

    const updateTeamBoardIntroduction = useCallback(
        async (introduction: string) => {
            await updateTeamBoardIntroductionMutation({
                variables: { introduction }
            })
    }, [])

    return { updateTeamBoardIntroduction }
}