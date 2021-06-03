import { useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/router"


import { DELETE_MY_PROFILE_TEAM_BOARD, GET_MY_PROFILE } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useDeleteMyProfileTeamBoard = () => {
    const [deleteMyProfileTeamBoardMutation] = useMutation(DELETE_MY_PROFILE_TEAM_BOARD, {
        refetchQueries: [{ query: GET_MY_PROFILE }]
    })

    const router = useRouter()
    const { onCloseConfirmTeamLeaveModal, onCloseMyProfileEditModal }  = useControllModal()
    const { showMessage } = useMessage()

    const deleteMyProfileTeamBoard = useCallback(
        async () => {
            await deleteMyProfileTeamBoardMutation({
                variables: { confirm: true }
            })
            showMessage({ title: "チームから脱退しました。", status: "success" })

            onCloseMyProfileEditModal()
            onCloseConfirmTeamLeaveModal()
            router.push("/team")
    }, [])

    
    return { deleteMyProfileTeamBoard }
}