import { useCallback } from "react"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/router"

import { UPDATE_TEAM_BOARD_COACH } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useUpdateTeamBoardCoach = () => {
    const [updateTeamBoardCoachMutation] = useMutation(UPDATE_TEAM_BOARD_COACH)
    const { onCloseConfirmHandOffCoachModal } = useControllModal()

    const { showMessage } = useMessage()

    const router = useRouter()

    const updateTeamBoardCoach = useCallback(
        async (profileId: string) => {
            await updateTeamBoardCoachMutation({
                variables: { profileId }
            })
            onCloseConfirmHandOffCoachModal()
            showMessage({ title: "コーチ権限を委譲しました。", status: "success" })
            router.push("/main")
    } ,[])

    return { updateTeamBoardCoach }
}