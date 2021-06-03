import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { GET_MY_PROFILE, UPDATE_TEAM } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useUpdateTeam = () => {
    const [updateTeamMutation] = useMutation(UPDATE_TEAM, {
        refetchQueries: [{ query: GET_MY_PROFILE }]
    })

    const { onCloseTeamEditModal } = useControllModal()

    const { showMessage } = useMessage()

    const updateTeam = useCallback(
        async (name: string, isLimitJoin: boolean, password: string) => {
            await updateTeamMutation({
                variables: { name, isLimitJoin, password }
            })
            showMessage({ title: "チームを編集しました。", status: "success" })
            onCloseTeamEditModal()
    }, [])

    return { updateTeam }
}