import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { DELETE_MANY_SCHEDULES, GET_MY_TEAM_SCHEDULES } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useDeleteManySchedules = () => {
    const [deleteManySchedulesMutation] = useMutation(DELETE_MANY_SCHEDULES, {
        refetchQueries: [{ query: GET_MY_TEAM_SCHEDULES }]
    })
    
    const { showMessage } = useMessage() 
    const { onCloseScheduleDeleteModal } = useControllModal()

    const deleteManySchedules = useCallback(
        async (startDate: string, endDate: string, trainingId: string) => {
            if (trainingId === ""){
                await deleteManySchedulesMutation({
                    variables: { startDate, endDate }
                })
            } else {
                await deleteManySchedulesMutation({
                    variables: { startDate, endDate, trainingId }
                })
            }
            showMessage({ title: "トレーニングを削除しました。" , status: "success" })
            onCloseScheduleDeleteModal()
        }, [])

    return { deleteManySchedules }
}