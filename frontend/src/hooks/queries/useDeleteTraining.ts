import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { DELETE_TRAINING, GET_MY_TEAM_TRAININGS } from "../../queries"
import { useMessage } from "../useMessage"

export const useDeleteTraining = () => {
    const [deleteTrainingMutation] = useMutation(DELETE_TRAINING, {
        refetchQueries: [{ query: GET_MY_TEAM_TRAININGS }]
    })

    const { showMessage } = useMessage()

    const deleteTraining = useCallback(
        async (trainingId: string) => {
            await deleteTrainingMutation({
                variables: { trainingId }
            })
            showMessage({ title: "トレーニングを削除しました。", status: "success" })
    }, [])
    
    return { deleteTraining }
}