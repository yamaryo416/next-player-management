import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { DELETE_ONE_PROFILE_TEAM_BOARD, GET_MY_TEAM_MEMBER } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"
import { NUM_PAGE } from "../../../constants"

export const useDeleteOneProfileTeamBoard = () => {
    const [deleteOneProfileTeamBoardMutation]   = useMutation(DELETE_ONE_PROFILE_TEAM_BOARD, {
        refetchQueries: [{ query: GET_MY_TEAM_MEMBER, variables: { first: NUM_PAGE  } }]
    })
    const { onCloseConfirmTeamLeaveModal } = useControllModal()

    const { showMessage } = useMessage()

    const deleteOneProfileTeamBoard = useCallback(
            async (profileId: string) => {
                await deleteOneProfileTeamBoardMutation({
                    variables: { profileId }
                })
                showMessage({ title: "ユーザーを脱退させました。", status: "success" })
                onCloseConfirmTeamLeaveModal()
            }
        ,[])
    
    return { deleteOneProfileTeamBoard }
}