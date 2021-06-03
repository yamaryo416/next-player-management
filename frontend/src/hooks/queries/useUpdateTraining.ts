import { useCallback } from "react"
import { useMutation } from "@apollo/client"

import { GET_MY_TEAM_TRAININGS, UPDATE_TRAINING,  } from "../../queries"
import { useControllModal } from "../useControllModal"
import { useMessage } from "../useMessage"

export const useUpdateTraining = () => {
    const [updateTrainingMutation] = useMutation(UPDATE_TRAINING, {
        refetchQueries: [{ query: GET_MY_TEAM_TRAININGS }]
    })

    const { showMessage } = useMessage()
    const { onCloseTrainingCreateOrUpdateModal } = useControllModal()
    
    const updateTraining = useCallback( 
        async (
            trainingId: string,
            title: string,
            count: number | undefined,
            load: number | undefined, 
            distance: number | undefined,
            description: string,
            iconNumber: number | undefined
            ) => {
            await updateTrainingMutation({
                variables: { trainingId, title, count, load, distance, description, iconNumber }
            })
            showMessage({ title: "トレーニングを編集しました。", status: "success" })
            onCloseTrainingCreateOrUpdateModal()
        }, [])

    return { updateTraining }
}