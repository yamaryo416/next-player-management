import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { DELETE_SCHEDULE, GET_MY_TEAM_SCHEDULES } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useDeleteSchedule = () => {
    const [deleteScheduleMutation] = useMutation(DELETE_SCHEDULE, {
        refetchQueries: [{ query: GET_MY_TEAM_SCHEDULES }]
    })

    const { onCloseConfirmScheduleDeleteModal } = useControllModal()

    const { showMessage } = useMessage()

    const deleteSchedule = useCallback(
        async (scheduleId: string) => {
            await deleteScheduleMutation({
                variables: { scheduleId }
            })
            showMessage({ title: "スケジュールを削除しました。", status: "success" })
            onCloseConfirmScheduleDeleteModal()
        },[]
    )

    return { deleteSchedule }
}